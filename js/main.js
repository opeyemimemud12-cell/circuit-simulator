/**
 * Main Application Entry Point
 * Initializes all systems and coordinates between modules
 */

(function() {
    'use strict';

    /**
     * Initialize the application
     */
    function initializeApp() {
        console.log('🔌 CircuitLab - Interactive Circuit Simulator');
        console.log('Initializing application modules...');

        // Initialize UI Controller
        UIController.init();
        console.log('✓ UI Controller initialized');

        // Setup Simulator event listeners
        setupSimulatorListeners();
        console.log('✓ Simulator listeners configured');

        // Try to load saved circuit
        try {
            UIController.loadCircuit();
        } catch (e) {
            console.log('No saved circuit found');
        }

        console.log('✓ Application ready!');
    }

    /**
     * Setup simulator event listeners
     */
    function setupSimulatorListeners() {
        // Update display when simulation runs
        Simulator.on('update', (data) => {
            updateSimulationDisplay(data.results);
        });

        // Handle component damage
        Simulator.on('componentDamage', (data) => {
            handleComponentDamage(data);
        });
    }

    /**
     * Update simulation display with real-time values
     */
    function updateSimulationDisplay(results) {
        const voltageDisplay = document.getElementById('voltage-display');
        const currentDisplay = document.getElementById('current-display');
        const powerDisplay = document.getElementById('power-display');

        if (voltageDisplay) {
            voltageDisplay.textContent = `Voltage: ${Utils.formatVoltage(results.totalVoltage)}`;
        }
        if (currentDisplay) {
            currentDisplay.textContent = `Current: ${Utils.formatCurrent(results.totalCurrent)}`;
        }
        if (powerDisplay) {
            powerDisplay.textContent = `Power: ${Utils.formatPower(results.totalPower)}`;
        }

        // Trigger render to show component states
        UIController.render();
    }

    /**
     * Handle component damage events
     */
    function handleComponentDamage(data) {
        const { component, damageType, message, severity } = data;
        
        console.warn('⚡ COMPONENT DAMAGE:', message);
        
        // Show toast notification
        UIController.showToast(message, 'error');
        
        // Play explosion effect
        AudioManager.playError();
        for (let i = 0; i < Math.floor(severity); i++) {
            setTimeout(() => {
                const freq = 100 + Math.random() * 400;
                AudioManager.playTone(freq, 0.15, 100);
            }, i * 150);
        }

        // Render to show damage
        UIController.render();
    }

    /**
     * Keyboard shortcuts
     */
    document.addEventListener('keydown', (e) => {
        // Ctrl+S or Cmd+S to save
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            document.getElementById('save-circuit').click();
        }

        // Delete key to delete selected component
        if (e.key === 'Delete') {
            const components = CircuitEngine.getAllComponents();
            components.forEach(comp => {
                if (comp.isSelected) {
                    CircuitEngine.removeComponent(comp.id);
                    UIController.showToast(`${comp.definition.name} deleted`, 'warning');
                    AudioManager.playError();
                }
            });
            UIController.render();
        }

        // Esc to deselect
        if (e.key === 'Escape') {
            const components = CircuitEngine.getAllComponents();
            components.forEach(comp => comp.isSelected = false);
            document.querySelector('.property-panel').classList.add('hidden');
            UIController.render();
        }

        // Ctrl+Z to undo (future feature)
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            console.log('Undo feature coming soon');
        }
    });

    /**
     * Handle window resize
     */
    window.addEventListener('resize', () => {
        UIController.render();
    });

    /**
     * Warn about unsaved changes
     */
    let hasChanges = false;
    window.addEventListener('beforeunload', (e) => {
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    });

    // Mark as changed when circuit is modified
    const originalAddComponent = CircuitEngine.addComponent;
    CircuitEngine.addComponent = function(component) {
        hasChanges = true;
        return originalAddComponent.call(this, component);
    };

    /**
     * Initialize when DOM is ready
     */
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    // Expose some functions globally for debugging
    window.CircuitLab = {
        Circuit: CircuitEngine,
        Simulator: Simulator,
        UI: UIController,
        Components: ComponentLibrary,
        Audio: AudioManager,
        Utils: Utils,
        version: '1.0.0'
    };

    console.log('Type "CircuitLab" in console to access API');
})();

/**
 * Example circuits for quick start
 */
const ExampleCircuits = {
    /**
     * Simple LED circuit
     */
    simpleLED: function() {
        CircuitEngine.clear();
        
        const battery = ComponentFactory.create(ComponentTypes.BATTERY, 50, 50);
        battery.properties.voltage.value = 5;
        CircuitEngine.addComponent(battery);

        const resistor = ComponentFactory.create(ComponentTypes.RESISTOR, 200, 50);
        resistor.properties.resistance.value = 220;
        CircuitEngine.addComponent(resistor);

        const led = ComponentFactory.create(ComponentTypes.LED, 350, 50);
        led.properties.color.value = 'red';
        CircuitEngine.addComponent(led);

        const wire1 = ComponentFactory.create(ComponentTypes.WIRE, 125, 40);
        const wire2 = ComponentFactory.create(ComponentTypes.WIRE, 275, 40);
        const wire3 = ComponentFactory.create(ComponentTypes.WIRE, 400, 40);

        CircuitEngine.addConnection(battery.id, 0, resistor.id, 0);
        CircuitEngine.addConnection(resistor.id, 1, led.id, 0);
        CircuitEngine.addConnection(led.id, 1, battery.id, 1);

        UIController.render();
        UIController.showToast('Simple LED circuit loaded', 'success');
    },

    /**
     * Arduino LED blink circuit
     */
    arduinoLED: function() {
        CircuitEngine.clear();
        
        const arduino = ComponentFactory.create(ComponentTypes.ARDUINO_UNO, 100, 100);
        CircuitEngine.addComponent(arduino);

        const led = ComponentFactory.create(ComponentTypes.LED, 350, 150);
        CircuitEngine.addComponent(led);

        const resistor = ComponentFactory.create(ComponentTypes.RESISTOR, 250, 150);
        resistor.properties.resistance.value = 220;
        CircuitEngine.addComponent(resistor);

        CircuitEngine.addConnection(arduino.id, 0, resistor.id, 0);
        CircuitEngine.addConnection(resistor.id, 1, led.id, 0);
        CircuitEngine.addConnection(led.id, 1, arduino.id, 1);

        UIController.render();
        UIController.showToast('Arduino LED circuit loaded', 'success');
    },

    /**
     * Servo motor control circuit
     */
    servoControl: function() {
        CircuitEngine.clear();
        
        const battery = ComponentFactory.create(ComponentTypes.BATTERY, 50, 100);
        battery.properties.voltage.value = 6;
        CircuitEngine.addComponent(battery);

        const arduino = ComponentFactory.create(ComponentTypes.ARDUINO_UNO, 200, 100);
        CircuitEngine.addComponent(arduino);

        const servo = ComponentFactory.create(ComponentTypes.SERVO_MOTOR, 400, 100);
        CircuitEngine.addComponent(servo);

        CircuitEngine.addConnection(battery.id, 0, arduino.id, 0);
        CircuitEngine.addConnection(battery.id, 0, servo.id, 0);
        CircuitEngine.addConnection(arduino.id, 0, servo.id, 2);
        CircuitEngine.addConnection(servo.id, 1, battery.id, 1);

        UIController.render();
        UIController.showToast('Servo control circuit loaded', 'success');
    },

    /**
     * Temperature monitoring circuit
     */
    temperatureSensor: function() {
        CircuitEngine.clear();
        
        const battery = ComponentFactory.create(ComponentTypes.BATTERY, 50, 100);
        battery.properties.voltage.value = 5;
        CircuitEngine.addComponent(battery);

        const arduino = ComponentFactory.create(ComponentTypes.ARDUINO_UNO, 200, 100);
        CircuitEngine.addComponent(arduino);

        const tempSensor = ComponentFactory.create(ComponentTypes.TEMP_SENSOR, 400, 100);
        CircuitEngine.addComponent(tempSensor);

        CircuitEngine.addConnection(battery.id, 0, tempSensor.id, 0);
        CircuitEngine.addConnection(tempSensor.id, 1, arduino.id, 0);
        CircuitEngine.addConnection(tempSensor.id, 2, battery.id, 1);

        UIController.render();
        UIController.showToast('Temperature sensor circuit loaded', 'success');
    }
};

// Load example circuit command: ExampleCircuits.simpleLED()