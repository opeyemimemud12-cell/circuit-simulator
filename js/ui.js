/**
 * UI Controller
 * Handles all user interface interactions and rendering
 */

const UIController = (() => {
    let selectedComponent = null;
    let currentTool = 'select';
    let zoomLevel = 1;
    let isDarkMode = false;
    let isDrawingWire = false;
    let wireStart = null;

    const canvas = document.getElementById('circuit-canvas');
    const ctx = canvas.getContext('2d');
    const propertyPanel = document.querySelector('.property-panel');

    // Canvas setup
    function resizeCanvas() {
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return {
        /**
         * Initialize UI
         */
        init() {
            this.setupEventListeners();
            this.loadTheme();
            this.populateHistoryTimeline();
            this.populateComponentsLibrary();
            this.populateTutorials();
            this.render();
        },

        /**
         * Setup all event listeners
         */
        setupEventListeners() {
            // Navigation
            document.querySelectorAll('.nav-btn').forEach(btn => {
                btn.addEventListener('click', (e) => this.switchSection(e.target.dataset.section));
            });

            // Theme toggle
            document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());

            // Save circuit
            document.getElementById('save-circuit').addEventListener('click', () => this.saveCircuit());

            // Canvas tools
            document.getElementById('tool-select').addEventListener('click', () => this.setTool('select'));
            document.getElementById('tool-wire').addEventListener('click', () => this.setTool('wire'));
            document.getElementById('tool-delete').addEventListener('click', () => this.setTool('delete'));

            // Sidebar tools
            document.getElementById('clear-canvas').addEventListener('click', () => this.clearCanvas());
            document.getElementById('run-simulation').addEventListener('click', () => this.runSimulation());
            document.getElementById('stop-simulation').addEventListener('click', () => this.stopSimulation());

            // Zoom controls
            document.getElementById('zoom-in').addEventListener('click', () => this.zoom(1.2));
            document.getElementById('zoom-out').addEventListener('click', () => this.zoom(0.8));

            // Draggable components
            document.querySelectorAll('.draggable-component').forEach(elem => {
                elem.addEventListener('dragstart', (e) => this.onComponentDragStart(e));
            });

            // Canvas interactions
            canvas.addEventListener('dragover', (e) => e.preventDefault());
            canvas.addEventListener('drop', (e) => this.onCanvasDrop(e));
            canvas.addEventListener('mousedown', (e) => this.onCanvasMouseDown(e));
            canvas.addEventListener('mousemove', (e) => this.onCanvasMouseMove(e));
            canvas.addEventListener('mouseup', (e) => this.onCanvasMouseUp(e));
            canvas.addEventListener('click', (e) => this.onCanvasClick(e));
            canvas.addEventListener('contextmenu', (e) => this.onCanvasRightClick(e));

            // Property panel close
            document.querySelector('.property-panel .close-btn')?.addEventListener('click', () => {
                propertyPanel.classList.add('hidden');
            });

            // Modal close buttons
            document.querySelectorAll('.modal .close-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.target.closest('.modal').classList.add('hidden');
                });
            });

            // Results modal
            document.getElementById('close-results')?.addEventListener('click', () => {
                document.getElementById('results-modal').classList.add('hidden');
            });
        },

        /**
         * Switch between sections (Simulator, History, Components, Tutorials)
         */
        switchSection(sectionId) {
            // Hide all sections
            document.querySelectorAll('main > section').forEach(sec => sec.classList.add('hidden'));
            document.getElementById(sectionId).classList.remove('hidden');

            // Update nav buttons
            document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelector(`[data-section="${sectionId}"]`).classList.add('active');

            // Stop simulation when leaving simulator
            if (sectionId !== 'simulator' && Simulator.isSimulating()) {
                Simulator.stop();
            }
        },

        /**
         * Toggle dark mode
         */
        toggleTheme() {
            isDarkMode = !isDarkMode;
            document.body.classList.toggle('dark-mode', isDarkMode);
            localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
            AudioManager.playClick();
        },

        /**
         * Load saved theme preference
         */
        loadTheme() {
            const savedTheme = localStorage.getItem('theme') || 'light';
            isDarkMode = savedTheme === 'dark';
            document.body.classList.toggle('dark-mode', isDarkMode);
        },

        /**
         * Set active tool
         */
        setTool(tool) {
            currentTool = tool;
            document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
            document.getElementById(`tool-${tool}`).classList.add('active');
            AudioManager.playClick();
        },

        /**
         * Handle zoom
         */
        zoom(factor) {
            zoomLevel = Utils.clamp(zoomLevel * factor, 0.5, 3);
            document.getElementById('zoom-level').textContent = `${Math.round(zoomLevel * 100)}%`;
            this.render();
        },

        /**
         * Handle component drag start
         */
        onComponentDragStart(e) {
            const componentType = e.target.closest('.draggable-component').dataset.component;
            e.dataTransfer.setData('componentType', componentType);
            e.dataTransfer.effectAllowed = 'copy';
        },

        /**
         * Handle canvas drop
         */
        onCanvasDrop(e) {
            e.preventDefault();
            const componentType = e.dataTransfer.getData('componentType');
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoomLevel;
            const y = (e.clientY - rect.top) / zoomLevel;

            const component = ComponentFactory.create(componentType, x, y);
            if (CircuitEngine.addComponent(component)) {
                AudioManager.playClick();
                this.showToast(`${component.definition.name} added`, 'success');
                this.render();
            }
        },

        /**
         * Handle canvas mouse down
         */
        onCanvasMouseDown(e) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoomLevel;
            const y = (e.clientY - rect.top) / zoomLevel;

            const components = CircuitEngine.getAllComponents();
            let hitComponent = null;

            // Check if clicking on a component
            for (let i = components.length - 1; i >= 0; i--) {
                const comp = components[i];
                if (Utils.pointInRect(x, y, comp.x, comp.y, comp.width, comp.height)) {
                    hitComponent = comp;
                    break;
                }
            }

            if (currentTool === 'select') {
                if (hitComponent) {
                    selectedComponent = hitComponent;
                    selectedComponent.isDragging = true;
                    selectedComponent.dragOffsetX = x - hitComponent.x;
                    selectedComponent.dragOffsetY = y - hitComponent.y;
                    this.showPropertyPanel(hitComponent);
                    AudioManager.playClick();
                } else {
                    selectedComponent = null;
                    propertyPanel.classList.add('hidden');
                }
            } else if (currentTool === 'wire' && hitComponent) {
                isDrawingWire = true;
                wireStart = { x: x, y: y, component: hitComponent };
            } else if (currentTool === 'delete' && hitComponent) {
                CircuitEngine.removeComponent(hitComponent.id);
                AudioManager.playError();
                this.showToast(`${hitComponent.definition.name} deleted`, 'warning');
                selectedComponent = null;
                propertyPanel.classList.add('hidden');
            }

            this.render();
        },

        /**
         * Handle canvas mouse move
         */
        onCanvasMouseMove(e) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoomLevel;
            const y = (e.clientY - rect.top) / zoomLevel;

            if (selectedComponent && selectedComponent.isDragging) {
                selectedComponent.x = x - selectedComponent.dragOffsetX;
                selectedComponent.y = y - selectedComponent.dragOffsetY;
            }

            if (isDrawingWire) {
                // Visual feedback for wire drawing
                canvas.style.cursor = 'crosshair';
            }

            this.render();
        },

        /**
         * Handle canvas mouse up
         */
        onCanvasMouseUp(e) {
            if (selectedComponent) {
                selectedComponent.isDragging = false;
            }

            if (isDrawingWire) {
                const rect = canvas.getBoundingClientRect();
                const x = (e.clientX - rect.left) / zoomLevel;
                const y = (e.clientY - rect.top) / zoomLevel;

                const components = CircuitEngine.getAllComponents();
                for (let i = components.length - 1; i >= 0; i--) {
                    const comp = components[i];
                    if (Utils.pointInRect(x, y, comp.x, comp.y, comp.width, comp.height) && comp.id !== wireStart.component.id) {
                        CircuitEngine.addConnection(
                            wireStart.component.id,
                            0,
                            comp.id,
                            0
                        );
                        AudioManager.playSuccess();
                        this.showToast('Connection created', 'success');
                        break;
                    }
                }
                isDrawingWire = false;
                wireStart = null;
            }

            canvas.style.cursor = currentTool === 'wire' ? 'crosshair' : 'default';
            this.render();
        },

        /**
         * Handle canvas click
         */
        onCanvasClick(e) {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoomLevel;
            const y = (e.clientY - rect.top) / zoomLevel;

            const components = CircuitEngine.getAllComponents();
            components.forEach(comp => {
                comp.isSelected = Utils.pointInRect(x, y, comp.x, comp.y, comp.width, comp.height);
            });

            this.render();
        },

        /**
         * Handle right click context menu
         */
        onCanvasRightClick(e) {
            e.preventDefault();
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / zoomLevel;
            const y = (e.clientY - rect.top) / zoomLevel;

            const components = CircuitEngine.getAllComponents();
            for (let comp of components) {
                if (Utils.pointInRect(x, y, comp.x, comp.y, comp.width, comp.height)) {
                    this.showContextMenu(e.clientX, e.clientY, comp);
                    break;
                }
            }
        },

        /**
         * Show context menu
         */
        showContextMenu(x, y, component) {
            // Remove existing context menu
            const existing = document.querySelector('.context-menu');
            if (existing) existing.remove();

            const menu = document.createElement('div');
            menu.className = 'context-menu';
            menu.style.left = x + 'px';
            menu.style.top = y + 'px';

            menu.innerHTML = `
                <button class="context-menu-item" data-action="edit">Edit Properties</button>
                <button class="context-menu-item" data-action="duplicate">Duplicate</button>
                <div class="context-menu-divider"></div>
                <button class="context-menu-item danger" data-action="delete">Delete</button>
            `;

            menu.querySelector('[data-action="edit"]').addEventListener('click', () => {
                this.showPropertyPanel(component);
                menu.remove();
            });

            menu.querySelector('[data-action="duplicate"]').addEventListener('click', () => {
                const newComp = ComponentFactory.create(component.type, component.x + 50, component.y + 50);
                CircuitEngine.addComponent(newComp);
                AudioManager.playSuccess();
                this.showToast(`${newComp.definition.name} duplicated`, 'success');
                this.render();
                menu.remove();
            });

            menu.querySelector('[data-action="delete"]').addEventListener('click', () => {
                CircuitEngine.removeComponent(component.id);
                AudioManager.playError();
                this.showToast(`${component.definition.name} deleted`, 'warning');
                propertyPanel.classList.add('hidden');
                this.render();
                menu.remove();
            });

            document.body.appendChild(menu);

            // Click outside to close
            setTimeout(() => {
                document.addEventListener('click', function closeMenu() {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                });
            }, 0);
        },

        /**
         * Show property panel for component
         */
        showPropertyPanel(component) {
            selectedComponent = component;
            const content = document.querySelector('.property-content');
            content.innerHTML = '';

            const title = document.createElement('h4');
            title.textContent = component.definition.name;
            title.style.marginBottom = '1rem';
            content.appendChild(title);

            // Render property inputs
            Object.entries(component.properties).forEach(([key, prop]) => {
                const group = document.createElement('div');
                group.className = 'property-input-group';

                const label = document.createElement('label');
                label.className = 'property-label';
                label.textContent = `${key.charAt(0).toUpperCase() + key.slice(1)}`;
                group.appendChild(label);

                const valueDiv = document.createElement('div');
                valueDiv.className = 'property-value';

                if (prop.type === 'boolean') {
                    const checkbox = document.createElement('input');
                    checkbox.type = 'checkbox';
                    checkbox.checked = prop.value;
                    checkbox.addEventListener('change', (e) => {
                        prop.value = e.target.checked;
                        component.properties[key] = prop;
                    });
                    valueDiv.appendChild(checkbox);
                } else if (prop.options) {
                    const select = document.createElement('select');
                    select.className = 'property-input';
                    prop.options.forEach(opt => {
                        const option = document.createElement('option');
                        option.value = opt;
                        option.textContent = opt;
                        option.selected = prop.value === opt;
                        select.appendChild(option);
                    });
                    select.addEventListener('change', (e) => {
                        prop.value = e.target.value;
                        component.properties[key] = prop;
                    });
                    valueDiv.appendChild(select);
                } else {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.className = 'property-input';
                    input.value = prop.value;
                    input.min = prop.min || 0;
                    input.max = prop.max || 1000000;
                    input.step = prop.step || 0.1;
                    input.addEventListener('change', (e) => {
                        prop.value = parseFloat(e.target.value);
                        component.properties[key] = prop;
                    });
                    valueDiv.appendChild(input);

                    if (prop.unit) {
                        const unit = document.createElement('span');
                        unit.className = 'property-unit';
                        unit.textContent = prop.unit;
                        valueDiv.appendChild(unit);
                    }
                }

                group.appendChild(valueDiv);
                content.appendChild(group);
            });

            propertyPanel.classList.remove('hidden');
        },

        /**
         * Populate history timeline
         */
        populateHistoryTimeline() {
            const timeline = document.querySelector('.timeline');
            getHistoryTimeline().forEach((item, index) => {
                const timelineItem = document.createElement('div');
                timelineItem.className = 'timeline-item';
                timelineItem.innerHTML = `
                    <div class="timeline-marker"></div>
                    <div class="timeline-content">
                        <div class="timeline-year">${item.year}</div>
                        <div class="timeline-title">${item.title}</div>
                        <div class="timeline-description">${item.description}</div>
                        <div style="margin-top: 0.5rem; font-size: 0.8rem; color: var(--text-light);">Impact: ${item.impact}</div>
                    </div>
                `;
                timeline.appendChild(timelineItem);
            });
        },

        /**
         * Populate components library
         */
        populateComponentsLibrary() {
            const grid = document.querySelector('.components-grid');
            Object.values(ComponentLibrary).forEach(component => {
                const card = document.createElement('div');
                card.className = 'component-card';
                card.innerHTML = `
                    <h3>${component.name}</h3>
                    <div class="component-specs">
                        <div class="spec-row">
                            <span class="spec-label">Type:</span>
                            <span class="spec-value">${component.type}</span>
                        </div>
                        <div class="spec-row">
                            <span class="spec-label">Terminals:</span>
                            <span class="spec-value">${component.terminals}</span>
                        </div>
                        <div class="spec-row">
                            <span class="spec-label">Description:</span>
                            <span class="spec-value">${component.description}</span>
                        </div>
                    </div>
                `;
                grid.appendChild(card);
            });
        },

        /**
         * Populate tutorials
         */
        populateTutorials() {
            const grid = document.querySelector('.tutorials-grid');
            getAllTutorials().forEach(tutorial => {
                const card = document.createElement('div');
                card.className = 'tutorial-card';
                card.innerHTML = `
                    <div class="tutorial-header">
                        <h3>${tutorial.title}</h3>
                        <div class="tutorial-difficulty">${tutorial.difficulty}</div>
                    </div>
                    <div class="tutorial-body">
                        <p class="tutorial-description">${tutorial.description}</p>
                        <div class="tutorial-time">⏱️ ${tutorial.time}</div>
                    </div>
                `;
                grid.appendChild(card);
            });
        },

        /**
         * Clear canvas
         */
        clearCanvas() {
            if (confirm('Are you sure you want to clear the canvas? This cannot be undone.')) {
                CircuitEngine.clear();
                selectedComponent = null;
                propertyPanel.classList.add('hidden');
                this.showToast('Canvas cleared', 'warning');
                this.render();
                AudioManager.playError();
            }
        },

        /**
         * Run simulation
         */
        runSimulation() {
            const validation = CircuitEngine.validateCircuit();
            if (!validation.isValid && validation.errors.length > 0) {
                this.showToast(`Warning: ${validation.errors[0].message}`, 'warning');
            }
            Simulator.start();
            this.showToast('Simulation started', 'success');
        },

        /**
         * Stop simulation
         */
        stopSimulation() {
            Simulator.stop();
            this.showToast('Simulation stopped', 'warning');
        },

        /**
         * Save circuit to localStorage
         */
        saveCircuit() {
            const data = CircuitEngine.export();
            localStorage.setItem('savedCircuit', JSON.stringify(data));
            this.showToast('Circuit saved successfully', 'success');
            AudioManager.playSuccess();
        },

        /**
         * Load circuit from localStorage
         */
        loadCircuit() {
            const saved = localStorage.getItem('savedCircuit');
            if (saved) {
                CircuitEngine.import(JSON.parse(saved));
                this.showToast('Circuit loaded', 'success');
                this.render();
            }
        },

        /**
         * Show toast notification
         */
        showToast(message, type = 'info') {
            const container = document.getElementById('toast-container');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<div class="toast-message">${message}</div>`;
            container.appendChild(toast);

            setTimeout(() => {
                toast.classList.add('exit');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        },

        /**
         * Main render function - draws everything on canvas
         */
        render() {
            // Clear canvas
            ctx.fillStyle = isDarkMode ? '#0f172a' : '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Apply zoom and translation
            ctx.save();
            ctx.scale(zoomLevel, zoomLevel);

            // Draw grid
            this.drawGrid();

            // Draw connections
            CircuitEngine.getAllConnections().forEach(conn => {
                this.drawConnection(conn);
            });

            // Draw components
            CircuitEngine.getAllComponents().forEach(component => {
                this.drawComponent(component);
            });

            // Draw wire being drawn
            if (isDrawingWire && wireStart) {
                ctx.strokeStyle = '#2563eb';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(wireStart.x + wireStart.component.width / 2, wireStart.y + wireStart.component.height / 2);
                ctx.lineTo(canvas.width / zoomLevel / 2, canvas.height / zoomLevel / 2);
                ctx.stroke();
            }

            ctx.restore();
        },

        /**
         * Draw grid background
         */
        drawGrid() {
            const gridSize = 20;
            ctx.strokeStyle = isDarkMode ? '#334155' : '#e5e7eb';
            ctx.lineWidth = 0.5;

            for (let x = 0; x < canvas.width / zoomLevel; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height / zoomLevel);
                ctx.stroke();
            }

            for (let y = 0; y < canvas.height / zoomLevel; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width / zoomLevel, y);
                ctx.stroke();
            }
        },

        /**
         * Draw connection/wire
         */
        drawConnection(conn) {
            const fromComp = CircuitEngine.getComponent(conn.from.componentId);
            const toComp = CircuitEngine.getComponent(conn.to.componentId);

            if (!fromComp || !toComp) return;

            const x1 = fromComp.x + fromComp.width / 2;
            const y1 = fromComp.y + fromComp.height / 2;
            const x2 = toComp.x + toComp.width / 2;
            const y2 = toComp.y + toComp.height / 2;

            ctx.strokeStyle = '#6b7280';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            
            // Draw curved path
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            ctx.quadraticCurveTo(mx, my, x2, y2);
            ctx.stroke();

            // Draw terminals
            ctx.fillStyle = '#10b981';
            ctx.beginPath();
            ctx.arc(x1, y1, 4, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x2, y2, 4, 0, Math.PI * 2);
            ctx.fill();
        },

        /**
         * Draw component on canvas
         */
        drawComponent(component) {
            const x = component.x;
            const y = component.y;
            const w = component.width;
            const h = component.height;

            // Draw shadow
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(x + 2, y + 2, w, h);

            // Draw background
            ctx.fillStyle = component.definition.color;
            ctx.fillRect(x, y, w, h);

            // Draw border
            ctx.strokeStyle = component.isSelected ? '#2563eb' : '#999';
            ctx.lineWidth = component.isSelected ? 3 : 2;
            ctx.strokeRect(x, y, w, h);

            // Draw component-specific graphics
            this.drawComponentShape(component, x, y, w, h);

            // Draw damage indicator
            if (component.isDamaged) {
                ctx.fillStyle = 'rgba(239, 68, 68, 0.5)';
                ctx.fillRect(x, y, w, h);
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 20px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('💥', x + w / 2, y + h / 2);
            }

            // Draw label
            ctx.fillStyle = isDarkMode ? '#f1f5f9' : '#1f2937';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(component.definition.name.substring(0, 8), x + w / 2, y + h + 15);
        },

        /**
         * Draw component-specific shapes and details
         */
        drawComponentShape(component, x, y, w, h) {
            ctx.strokeStyle = isDarkMode ? '#f1f5f9' : '#1f2937';
            ctx.fillStyle = isDarkMode ? '#f1f5f9' : '#1f2937';
            ctx.lineWidth = 1.5;
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';

            switch (component.type) {
                case ComponentTypes.LED:
                    // Draw LED circle
                    ctx.beginPath();
                    ctx.arc(x + w / 2, y + h / 2, w / 3, 0, Math.PI * 2);
                    if (component.isLit) {
                        ctx.fillStyle = component.properties.color.value === 'red' ? '#ff0000' : '#ffff00';
                        ctx.fill();
                        // Draw glow
                        ctx.shadowColor = ctx.fillStyle;
                        ctx.shadowBlur = 20;
                    }
                    ctx.stroke();
                    ctx.shadowBlur = 0;
                    break;

                case ComponentTypes.BATTERY:
                    // Draw battery positive and negative terminals
                    ctx.fillRect(x + w / 3, y + 5, 4, h - 10); // negative
                    ctx.fillRect(x + 2 * w / 3 - 2, y + 5, 4, h - 10); // positive
                    ctx.fillText('+', x + 2 * w / 3, y + h - 5);
                    ctx.fillText('−', x + w / 3, y + h - 5);
                    break;

                case ComponentTypes.SWITCH:
                    // Draw switch lever
                    ctx.beginPath();
                    if (component.properties.state.value) {
                        ctx.moveTo(x + w / 4, y + h / 2 + 5);
                        ctx.lineTo(x + 3 * w / 4, y + h / 2 - 5);
                    } else {
                        ctx.moveTo(x + w / 4, y + h / 2 - 5);
                        ctx.lineTo(x + 3 * w / 4, y + h / 2 + 5);
                    }
                    ctx.stroke();
                    break;

                case ComponentTypes.RESISTOR:
                    // Draw resistor zigzag
                    ctx.beginPath();
                    ctx.moveTo(x + 5, y + h / 2);
                    for (let i = 0; i < 4; i++) {
                        ctx.lineTo(x + 10 + i * 10, y + (i % 2 === 0 ? h / 4 : 3 * h / 4));
                    }
                    ctx.lineTo(x + w - 5, y + h / 2);
                    ctx.stroke();
                    break;

                case ComponentTypes.CAPACITOR:
                    // Draw capacitor plates
                    ctx.beginPath();
                    ctx.moveTo(x + w / 2 - 2, y + 5);
                    ctx.lineTo(x + w / 2 - 2, y + h - 5);
                    ctx.stroke();
                    ctx.beginPath();
                    ctx.moveTo(x + w / 2 + 2, y + 5);
                    ctx.lineTo(x + w / 2 + 2, y + h - 5);
                    ctx.stroke();
                    break;

                case ComponentTypes.ARDUINO_UNO:
                    // Draw Arduino board with LEDs
                    ctx.fillStyle = '#00A4EF';
                    ctx.fillRect(x + 5, y + 5, w - 10, h - 10);
                    ctx.strokeStyle = '#ffffff';
                    ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
                    
                    // Draw power LED
                    ctx.fillStyle = Simulator.isSimulating() ? '#00ff00' : '#999';
                    ctx.beginPath();
                    ctx.arc(x + 15, y + 15, 3, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw TX/RX LEDs (blinking)
                    const blinkState = Math.sin(Date.now() / 100) > 0;
                    ctx.fillStyle = blinkState && Simulator.isSimulating() ? '#ffff00' : '#333';
                    ctx.beginPath();
                    ctx.arc(x + 25, y + 15, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    ctx.fillStyle = blinkState && Simulator.isSimulating() ? '#ff0000' : '#333';
                    ctx.beginPath();
                    ctx.arc(x + 35, y + 15, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    
                    // Draw text label
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 10px Arial';
                    ctx.textAlign = 'center';
                    ctx.fillText('ARDUINO', x + w / 2, y + h / 2 + 5);
                    break;

                case ComponentTypes.BREADBOARD:
                    // Draw breadboard holes grid
                    ctx.fillStyle = '#444';
                    for (let row = 0; row < 4; row++) {
                        for (let col = 0; col < 5; col++) {
                            ctx.beginPath();
                            ctx.arc(
                                x + 10 + col * 12,
                                y + 10 + row * 12,
                                2,
                                0,
                                Math.PI * 2
                            );
                            ctx.fill();
                        }
                    }
                    break;

                case ComponentTypes.SERVO_MOTOR:
                    // Draw servo with rotating shaft
                    const servoAngle = component.servoAngle || 0;
                    ctx.save();
                    ctx.translate(x + w / 2, y + h / 2);
                    ctx.rotate(servoAngle * Math.PI / 180);
                    ctx.strokeStyle = ctx.fillStyle = '#333';
                    ctx.fillRect(-w / 4, -2, w / 2, 4);
                    ctx.restore();
                    ctx.fillText('Servo', x + w / 2, y + h - 5);
                    break;

                case ComponentTypes.TEMP_SENSOR:
                    // Draw thermometer
                    ctx.beginPath();
                    ctx.arc(x + w / 2, y + h - 5, 3, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.moveTo(x + w / 2, y + h - 8);
                    ctx.lineTo(x + w / 2, y + 5);
                    ctx.stroke();
                    if (component.sensorReading) {
                        ctx.fillText(Math.round(component.sensorReading) + '°C', x + w / 2, y + 25);
                    }
                    break;

                case ComponentTypes.DISTANCE_SENSOR:
                    // Draw ultrasonic sensor
                    ctx.beginPath();
                    ctx.arc(x + w / 3, y + h / 2, 4, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(x + 2 * w / 3, y + h / 2, 4, 0, Math.PI * 2);
                    ctx.fill();
                    if (component.sensorReading) {
                        ctx.fillText(Math.round(component.sensorReading) + 'cm', x + w / 2, y + h - 5);
                    }
                    break;

                case ComponentTypes.MOTION_SENSOR:
                    // Draw motion sensor with detection indicator
                    ctx.beginPath();
                    ctx.arc(x + w / 2, y + h / 2, 5, 0, Math.PI * 2);
                    if (component.motionDetected) {
                        ctx.fillStyle = '#ff0000';
                        ctx.fill();
                    } else {
                        ctx.stroke();
                    }
                    break;
            }
        }
    };
})();