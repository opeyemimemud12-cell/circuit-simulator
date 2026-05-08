/**
 * Component Definitions
 * Defines all circuit components and their properties
 */

const ComponentTypes = {
    // Basic components
    RESISTOR: 'resistor',
    CAPACITOR: 'capacitor',
    INDUCTOR: 'inductor',
    LED: 'led',
    BATTERY: 'battery',
    SWITCH: 'switch',
    WIRE: 'wire',
    GROUND: 'ground',
    
    // Arduino and Boards
    ARDUINO_UNO: 'arduino-uno',
    ARDUINO_NANO: 'arduino-nano',
    BREADBOARD: 'breadboard',
    
    // Motors and Actuators
    DC_MOTOR: 'dc-motor',
    SERVO_MOTOR: 'servo',
    STEPPER_MOTOR: 'stepper',
    
    // Sensors
    TEMP_SENSOR: 'temp-sensor',
    DISTANCE_SENSOR: 'distance-sensor',
    MOTION_SENSOR: 'motion-sensor',
    LIGHT_SENSOR: 'light-sensor',
    SOUND_SENSOR: 'sound-sensor'
};

const ComponentLibrary = {
    [ComponentTypes.RESISTOR]: {
        name: 'Resistor',
        type: ComponentTypes.RESISTOR,
        width: 80,
        height: 30,
        terminals: 2,
        properties: {
            resistance: { value: 1000, unit: 'Ω', min: 0.1, max: 10000000 },
            tolerance: { value: 5, unit: '%', min: 0.1, max: 20 }
        },
        description: 'Resistor - Limits current flow and dissipates power as heat',
        icon: 'resistor',
        color: '#FF6B6B',
        powerRating: 0.25 // watts
    },

    [ComponentTypes.CAPACITOR]: {
        name: 'Capacitor',
        type: ComponentTypes.CAPACITOR,
        width: 70,
        height: 30,
        terminals: 2,
        properties: {
            capacitance: { value: 0.0001, unit: 'F', min: 1e-12, max: 1 },
            voltage: { value: 16, unit: 'V', min: 1, max: 1000 }
        },
        description: 'Capacitor - Stores electrical energy',
        icon: 'capacitor',
        color: '#4ECDC4',
        energyStorage: true
    },

    [ComponentTypes.LED]: {
        name: 'LED',
        type: ComponentTypes.LED,
        width: 50,
        height: 50,
        terminals: 2,
        properties: {
            color: { value: 'red', options: ['red', 'green', 'blue', 'yellow', 'white'] },
            forwardVoltage: { value: 2.0, unit: 'V', min: 1.5, max: 3.5 },
            maxCurrent: { value: 0.02, unit: 'A', min: 0.005, max: 0.1 }
        },
        description: 'LED - Light Emitting Diode',
        icon: 'led',
        color: '#FFD93D',
        isOutput: true
    },

    [ComponentTypes.BATTERY]: {
        name: 'Battery',
        type: ComponentTypes.BATTERY,
        width: 40,
        height: 70,
        terminals: 2,
        properties: {
            voltage: { value: 5, unit: 'V', min: 1.5, max: 48 },
            capacity: { value: 2000, unit: 'mAh', min: 100, max: 100000 }
        },
        description: 'Battery - Power source for circuit',
        icon: 'battery',
        color: '#95E1D3',
        isPowerSource: true
    },

    [ComponentTypes.SWITCH]: {
        name: 'Switch',
        type: ComponentTypes.SWITCH,
        width: 70,
        height: 40,
        terminals: 2,
        properties: {
            state: { value: false, type: 'boolean' }, // false = open, true = closed
            resistance: { value: 0.01, unit: 'Ω', min: 0, max: 1 } // when closed
        },
        description: 'Switch - Opens or closes circuit connection',
        icon: 'switch',
        color: '#A8D8EA',
        isInteractive: true
    },

    [ComponentTypes.ARDUINO_UNO]: {
        name: 'Arduino UNO',
        type: ComponentTypes.ARDUINO_UNO,
        width: 100,
        height: 150,
        terminals: 30,
        properties: {
            voltage: { value: 5, unit: 'V' },
            clockSpeed: { value: 16, unit: 'MHz' }
        },
        description: 'Arduino UNO - Microcontroller board for automation',
        icon: 'arduino',
        color: '#00A4EF',
        isController: true
    },

    [ComponentTypes.BREADBOARD]: {
        name: 'Breadboard',
        type: ComponentTypes.BREADBOARD,
        width: 180,
        height: 250,
        terminals: 60,
        properties: {
            rows: { value: 30, unit: 'rows' },
            columns: { value: 5, unit: 'columns' }
        },
        description: 'Breadboard - Solderless prototyping platform',
        icon: 'breadboard',
        color: '#FFB6B9',
        isBoard: true
    },

    [ComponentTypes.SERVO_MOTOR]: {
        name: 'Servo Motor',
        type: ComponentTypes.SERVO_MOTOR,
        width: 60,
        height: 80,
        terminals: 3,
        properties: {
            voltage: { value: 5, unit: 'V', min: 3, max: 6 },
            torque: { value: 2.5, unit: 'kg·cm', min: 1, max: 10 },
            speed: { value: 60, unit: 'deg/sec', min: 30, max: 300 }
        },
        description: 'Servo Motor - Controlled position rotation device',
        icon: 'servo',
        color: '#AA96DA',
        isActuator: true
    },

    [ComponentTypes.TEMP_SENSOR]: {
        name: 'Temperature Sensor',
        type: ComponentTypes.TEMP_SENSOR,
        width: 50,
        height: 70,
        terminals: 3,
        properties: {
            type: { value: 'LM35', options: ['LM35', 'DHT11', 'DS18B20'] },
            range: { value: '-40 to 125°C' }
        },
        description: 'Temperature Sensor - Measures thermal energy',
        icon: 'sensor',
        color: '#FCBAD3',
        isSensor: true
    },

    [ComponentTypes.DISTANCE_SENSOR]: {
        name: 'Ultrasonic Sensor',
        type: ComponentTypes.DISTANCE_SENSOR,
        width: 70,
        height: 50,
        terminals: 4,
        properties: {
            range: { value: '2cm to 400cm' },
            frequency: { value: 40, unit: 'kHz' }
        },
        description: 'Ultrasonic Sensor - Measures distance using sound waves',
        icon: 'sensor',
        color: '#A7FFEB',
        isSensor: true
    },

    [ComponentTypes.MOTION_SENSOR]: {
        name: 'Motion Sensor',
        type: ComponentTypes.MOTION_SENSOR,
        width: 50,
        height: 50,
        terminals: 3,
        properties: {
            type: { value: 'PIR', options: ['PIR', 'Microwave'] },
            range: { value: '7m' }
        },
        description: 'Motion Sensor - Detects movement via infrared',
        icon: 'sensor',
        color: '#FFE0B2',
        isSensor: true
    }
};

/**
 * Component Factory
 */
const ComponentFactory = {
    create(type, x = 0, y = 0) {
        const definition = ComponentLibrary[type];
        if (!definition) return null;

        return {
            id: Utils.generateId(),
            type: type,
            x: x,
            y: y,
            width: definition.width,
            height: definition.height,
            rotation: 0,
            terminals: Array(definition.terminals).fill(null).map((_, i) => ({
                id: Utils.generateId(),
                index: i,
                connected: []
            })),
            properties: Utils.deepClone(definition.properties),
            definition: definition,
            isSelected: false,
            isDragging: false
        };
    },

    getDefinition(type) {
        return ComponentLibrary[type];
    }
};