/**
 * Main Simulator Engine
 * Real-time circuit simulation with electrical calculations
 */

const Simulator = (() => {
    let isRunning = false;
    let animationFrameId = null;
    let lastUpdateTime = Date.now();
    let simulationTime = 0;
    const timeStep = 0.001; // 1ms simulation step

    const observers = {
        update: [],
        error: [],
        componentDamage: []
    };

    return {
        /**
         * Subscribe to simulation events
         */
        on(event, callback) {
            if (observers[event]) {
                observers[event].push(callback);
            }
        },

        /**
         * Emit simulation events
         */
        emit(event, data) {
            if (observers[event]) {
                observers[event].forEach(callback => callback(data));
            }
        },

        /**
         * Start simulation
         */
        start() {
            if (isRunning) return;
            isRunning = true;
            simulationTime = 0;
            lastUpdateTime = Date.now();
            AudioManager.playPowerOn();
            this.update();
        },

        /**
         * Stop simulation
         */
        stop() {
            if (!isRunning) return;
            isRunning = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
            AudioManager.playPowerOff();
        },

        /**
         * Main simulation loop
         */
        update() {
            if (!isRunning) return;

            const currentTime = Date.now();
            const deltaTime = (currentTime - lastUpdateTime) / 1000;
            lastUpdateTime = currentTime;
            simulationTime += deltaTime;

            // Run simulation step
            this.simulationStep(deltaTime);

            // Emit update event with results
            const results = CircuitEngine.analyzeCircuit();
            this.emit('update', {
                time: simulationTime,
                results: results,
                components: CircuitEngine.getAllComponents()
            });

            animationFrameId = requestAnimationFrame(() => this.update());
        },

        /**
         * Execute one simulation step
         */
        simulationStep(deltaTime) {
            const components = CircuitEngine.getAllComponents();
            const validation = CircuitEngine.validateCircuit();

            // Check for over-voltage and over-current conditions
            const results = CircuitEngine.analyzeCircuit();
            
            components.forEach(component => {
                const values = results.components[component.id];
                if (!values) return;

                const def = component.definition;

                // Check LED over-current
                if (component.type === ComponentTypes.LED) {
                    const maxCurrent = component.properties.maxCurrent.value;
                    if (values.current > maxCurrent) {
                        this.damageComponent(component, 'OVER_CURRENT', values.current, maxCurrent);
                    }
                    // LED lights up when current is sufficient
                    component.isLit = values.isLit;
                }

                // Check resistor over-power
                if (component.type === ComponentTypes.RESISTOR) {
                    const powerRating = def.powerRating || 0.25; // Default 0.25W
                    if (values.power > powerRating) {
                        this.damageComponent(component, 'OVER_POWER', values.power, powerRating);
                    }
                }

                // Check battery over-current
                if (component.type === ComponentTypes.BATTERY) {
                    const maxBatteryCurrent = 3.0; // 3A max continuous
                    if (values.current > maxBatteryCurrent) {
                        this.damageComponent(component, 'OVER_CURRENT', values.current, maxBatteryCurrent);
                    }
                }

                // Check capacitor over-voltage
                if (component.type === ComponentTypes.CAPACITOR) {
                    const maxVoltage = component.properties.voltage.value;
                    if (values.voltage > maxVoltage * 1.2) { // 20% overvoltage tolerance
                        this.damageComponent(component, 'OVER_VOLTAGE', values.voltage, maxVoltage);
                    }
                }

                // Servo motor operation
                if (component.type === ComponentTypes.SERVO_MOTOR) {
                    const maxVoltage = component.properties.voltage.value;
                    if (values.voltage < maxVoltage * 0.8) {
                        // Servo not enough power - add visual feedback
                        component.insufficientPower = true;
                    } else {
                        component.insufficientPower = false;
                        // Simulate servo rotation
                        component.servoAngle = (simulationTime * 30) % 360; // Rotates 30°/sec
                    }
                }

                // Temperature sensor reading
                if (component.type === ComponentTypes.TEMP_SENSOR) {
                    // Simulate temperature reading (25°C base, oscillating)
                    component.sensorReading = 25 + 5 * Math.sin(simulationTime * 0.5);
                }

                // Distance sensor reading
                if (component.type === ComponentTypes.DISTANCE_SENSOR) {
                    // Simulate distance reading (20cm base, oscillating)
                    component.sensorReading = 20 + 10 * Math.sin(simulationTime * 0.3);
                }

                // Motion sensor (detects movement when current flows)
                if (component.type === ComponentTypes.MOTION_SENSOR) {
                    component.motionDetected = values.current > 0.01;
                }
            });
        },

        /**
         * Handle component damage
         */
        damageComponent(component, damageType, actualValue, limitValue) {
            if (component.isDamaged) return; // Already damaged

            component.isDamaged = true;
            component.damageType = damageType;
            component.actualValue = actualValue;
            component.limitValue = limitValue;

            const severity = actualValue / limitValue;
            const message = `${component.definition.name} damaged! ${damageType.replace('_', ' ')}: ${actualValue.toFixed(2)} > ${limitValue.toFixed(2)}`;

            // Play explosion effect
            this.playExplosionEffect(component, severity);

            this.emit('componentDamage', {
                component: component,
                damageType: damageType,
                message: message,
                severity: severity
            });
        },

        /**
         * Play explosion/damage sound effect
         */
        playExplosionEffect(component, severity) {
            // Create explosion sound pattern based on severity
            AudioManager.playError();
            
            // Low frequency boom
            AudioManager.playTone(100 + severity * 100, 0.2, 200);
            
            // Multiple crackle sounds
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    const freq = 200 + Math.random() * 400;
                    AudioManager.playTone(freq, 0.1 * (1 - i * 0.2), 80);
                }, i * 100);
            }
            
            // High pitch failure
            setTimeout(() => {
                AudioManager.playTone(3000, 0.15, 150);
            }, 300);
        },

        /**
         * Get current simulation state
         */
        getState() {
            return {
                isRunning: isRunning,
                simulationTime: simulationTime,
                components: CircuitEngine.getAllComponents(),
                analysis: CircuitEngine.analyzeCircuit()
            };
        },

        /**
         * Check if simulation is running
         */
        isSimulating() {
            return isRunning;
        }
    };
})();