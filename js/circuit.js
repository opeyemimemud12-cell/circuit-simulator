/**
 * Circuit Simulator Core Engine
 * Handles circuit topology and electrical calculations
 */

const CircuitEngine = (() => {
    let components = [];
    let connections = [];
    let circuits = [];
    let isSimulating = false;

    return {
        /**
         * Add component to circuit
         */
        addComponent(component) {
            if (!component) return false;
            components.push(component);
            return true;
        },

        /**
         * Remove component from circuit
         */
        removeComponent(componentId) {
            const index = components.findIndex(c => c.id === componentId);
            if (index === -1) return false;

            const component = components[index];
            // Remove all connections to this component
            connections = connections.filter(conn => 
                conn.from.componentId !== componentId && 
                conn.to.componentId !== componentId
            );
            components.splice(index, 1);
            return true;
        },

        /**
         * Get component by ID
         */
        getComponent(id) {
            return components.find(c => c.id === id);
        },

        /**
         * Get all components
         */
        getAllComponents() {
            return [...components];
        },

        /**
         * Connect two terminals
         */
        addConnection(fromComponentId, fromTerminal, toComponentId, toTerminal) {
            const connection = {
                id: Utils.generateId(),
                from: { componentId: fromComponentId, terminal: fromTerminal },
                to: { componentId: toComponentId, terminal: toTerminal }
            };
            connections.push(connection);
            return connection;
        },

        /**
         * Remove connection
         */
        removeConnection(connectionId) {
            const index = connections.findIndex(c => c.id === connectionId);
            if (index === -1) return false;
            connections.splice(index, 1);
            return true;
        },

        /**
         * Get all connections
         */
        getAllConnections() {
            return [...connections];
        },

        /**
         * Analyze circuit and calculate electrical values
         */
        analyzeCircuit() {
            this.buildCircuitGraph();
            return this.calculateElectricalValues();
        },

        /**
         * Build circuit topology graph
         */
        buildCircuitGraph() {
            circuits = [];
            const visited = new Set();
            const graph = new Map();

            // Build adjacency list
            connections.forEach(conn => {
                if (!graph.has(conn.from.componentId)) graph.set(conn.from.componentId, []);
                if (!graph.has(conn.to.componentId)) graph.set(conn.to.componentId, []);
                graph.get(conn.from.componentId).push(conn.to.componentId);
                graph.get(conn.to.componentId).push(conn.from.componentId);
            });

            // Find connected components (simple circuits)
            const visit = (nodeId, circuit) => {
                if (visited.has(nodeId)) return;
                visited.add(nodeId);
                circuit.push(nodeId);
                graph.get(nodeId)?.forEach(neighbor => visit(neighbor, circuit));
            };

            graph.forEach((_, nodeId) => {
                if (!visited.has(nodeId)) {
                    const circuit = [];
                    visit(nodeId, circuit);
                    if (circuit.length > 0) circuits.push(circuit);
                }
            });
        },

        /**
         * Calculate electrical values for all components
         */
        calculateElectricalValues() {
            const results = {
                totalVoltage: 0,
                totalCurrent: 0,
                totalPower: 0,
                components: {}
            };

            circuits.forEach(circuit => {
                const circuitResult = this.analyzeCircuitPath(circuit);
                results.totalVoltage += circuitResult.voltage;
                results.totalCurrent += circuitResult.current;
                results.totalPower += circuitResult.power;
                
                circuit.forEach(componentId => {
                    results.components[componentId] = circuitResult.componentValues[componentId] || {};
                });
            });

            return results;
        },

        /**
         * Analyze single circuit path (simplified Ohm's law)
         */
        analyzeCircuitPath(circuit) {
            let totalVoltage = 0;
            let totalResistance = 0;
            const componentValues = {};

            circuit.forEach(componentId => {
                const component = this.getComponent(componentId);
                if (!component) return;

                const def = component.definition;

                // Sum voltage sources
                if (def.isPowerSource) {
                    totalVoltage += component.properties.voltage.value;
                }

                // Sum resistances in series
                if (component.type === ComponentTypes.RESISTOR) {
                    totalResistance += component.properties.resistance.value;
                } else if (component.type === ComponentTypes.SWITCH) {
                    if (component.properties.state.value) {
                        totalResistance += component.properties.resistance.value;
                    } else {
                        // Open switch = infinite resistance
                        totalResistance = Infinity;
                    }
                }
            });

            // Calculate current using Ohm's law: I = V / R
            const current = totalResistance === 0 || totalResistance === Infinity 
                ? 0 
                : totalVoltage / totalResistance;

            const power = totalVoltage * current;

            // Calculate values for each component
            circuit.forEach(componentId => {
                const component = this.getComponent(componentId);
                if (!component) return;

                const def = component.definition;
                const values = {};

                if (component.type === ComponentTypes.RESISTOR) {
                    values.voltage = current * component.properties.resistance.value;
                    values.current = current;
                    values.power = values.voltage * values.current;
                } else if (component.type === ComponentTypes.LED) {
                    values.current = current;
                    values.voltage = component.properties.forwardVoltage.value;
                    values.isLit = current > 0.001; // Threshold for LED to light
                    values.power = values.voltage * values.current;
                } else if (component.type === ComponentTypes.BATTERY) {
                    values.voltage = component.properties.voltage.value;
                    values.current = current;
                    values.power = values.voltage * values.current;
                } else if (def.isPowerSource) {
                    values.voltage = component.properties.voltage?.value || 0;
                    values.current = current;
                    values.power = values.voltage * current;
                } else {
                    values.voltage = totalVoltage;
                    values.current = current;
                    values.power = power;
                }

                componentValues[componentId] = values;
            });

            return {
                voltage: totalVoltage,
                current: current,
                power: power,
                resistance: totalResistance,
                componentValues: componentValues
            };
        },

        /**
         * Validate circuit for errors
         */
        validateCircuit() {
            const errors = [];
            
            // Check for dangling connections
            components.forEach(component => {
                component.terminals.forEach(terminal => {
                    const isConnected = connections.some(conn => 
                        (conn.from.componentId === component.id && conn.from.terminal === terminal.index) ||
                        (conn.to.componentId === component.id && conn.to.terminal === terminal.index)
                    );
                    
                    if (!isConnected && component.definition.terminals > 0) {
                        // Some terminals can be optional
                    }
                });
            });

            // Check for short circuits
            this.buildCircuitGraph();
            circuits.forEach(circuit => {
                let powerSources = 0;
                let totalResistance = 0;

                circuit.forEach(componentId => {
                    const component = this.getComponent(componentId);
                    if (!component) return;

                    if (component.definition.isPowerSource) {
                        powerSources++;
                    }
                    if (component.type === ComponentTypes.RESISTOR) {
                        totalResistance += component.properties.resistance.value;
                    }
                });

                if (powerSources > 0 && totalResistance === 0) {
                    errors.push({
                        type: 'warning',
                        message: 'Possible short circuit detected in circuit path'
                    });
                }
            });

            return { isValid: errors.length === 0, errors };
        },

        /**
         * Clear all components and connections
         */
        clear() {
            components = [];
            connections = [];
            circuits = [];
        },

        /**
         * Export circuit as JSON
         */
        export() {
            return {
                components: Utils.deepClone(components),
                connections: Utils.deepClone(connections),
                timestamp: new Date().toISOString()
            };
        },

        /**
         * Import circuit from JSON
         */
        import(data) {
            this.clear();
            if (data.components) components = Utils.deepClone(data.components);
            if (data.connections) connections = Utils.deepClone(data.connections);
        }
    };
})();