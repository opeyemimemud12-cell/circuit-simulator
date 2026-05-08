/**
 * Robotics & Electronics History Data
 * Timeline of important milestones
 */

const RoboticsHistory = [
    {
        year: 1947,
        title: 'First Transistor Invented',
        description: 'Shockley, Bardeen, and Brattain at Bell Labs invent the transistor, revolutionizing electronics by replacing vacuum tubes. This tiny device becomes the building block for all modern electronics.',
        impact: 'Electronics',
        image: '⚡'
    },
    {
        year: 1954,
        title: 'First Industrial Robot (UNIMATE)',
        description: 'George Devol creates UNIMATE, the first industrial robot. It was used at General Motors to lift and stack metal parts, marking the beginning of factory automation.',
        impact: 'Robotics',
        image: '🤖'
    },
    {
        year: 1961,
        title: 'IC (Integrated Circuit) Revolution',
        description: 'Jack Kilby and Robert Noyce independently develop the integrated circuit, allowing thousands of transistors on a single chip. This enables complex electronic systems.',
        impact: 'Electronics',
        image: '💻'
    },
    {
        year: 1965,
        title: 'Moores Law Predicted',
        description: 'Gordon Moore predicts that the number of transistors on a chip doubles every two years. This observation drives the semiconductor industry for decades.',
        impact: 'Computing',
        image: '📈'
    },
    {
        year: 1973,
        title: 'First Microprocessor Robot',
        description: 'Robots begin using microprocessors, allowing programmable behavior and autonomous decision-making. This marks the beginning of intelligent robotics.',
        impact: 'Robotics',
        image: '🧠'
    },
    {
        year: 1983,
        title: 'First Personal Computer Revolution',
        description: 'PCs become accessible to consumers. The Apple II, Commodore 64, and IBM PC democratize computing and enable hobbyist electronics projects.',
        impact: 'Computing',
        image: '💾'
    },
    {
        year: 1991,
        title: 'First Web Server and Browser',
        description: 'Tim Berners-Lee releases the World Wide Web. This enables remote connectivity for robotics and IoT devices, transforming automation.',
        impact: 'Connectivity',
        image: '🌐'
    },
    {
        year: 2001,
        title: 'Arduino Project Begins',
        description: 'The Arduino platform is developed as an open-source electronics prototyping platform. It democratizes embedded systems and robotics for students and makers.',
        impact: 'Maker Movement',
        image: '🛠️'
    },
    {
        year: 2005,
        title: 'DARPA Grand Challenge - Stanley Wins',
        description: 'Stanley, a self-driving car, wins the DARPA Grand Challenge, driving 131 miles autonomously in the desert. This accelerates autonomous vehicle development.',
        impact: 'Autonomy',
        image: '🚗'
    },
    {
        year: 2011,
        title: 'IBM Watson Wins Jeopardy!',
        description: 'IBM Watson defeats Jeopardy champions, demonstrating advanced AI and natural language processing. This shows AI potential beyond traditional computing.',
        impact: 'AI',
        image: '🧠'
    },
    {
        year: 2016,
        title: 'AlphaGo Defeats Lee Sedol',
        description: 'DeepMind\'s AlphaGo defeats world Go champion Lee Sedol, proving deep learning can master complex strategy games with intuitive decision-making.',
        impact: 'AI & Machine Learning',
        image: '🎮'
    },
    {
        year: 2020,
        title: 'IoT and Edge Computing Boom',
        description: 'IoT devices reach billions worldwide. Edge computing brings processing closer to sensors, enabling real-time robotics and autonomous systems.',
        impact: 'IoT',
        image: '📡'
    },
    {
        year: 2023,
        title: 'Generative AI and Robotics Convergence',
        description: 'AI models like ChatGPT and GPT-4 are integrated with robotics, enabling robots to understand natural language and interact intelligently with humans.',
        impact: 'AI & Robotics',
        image: '🤖💬'
    },
    {
        year: 2024,
        title: 'Advanced Humanoid Robots',
        description: 'Companies achieve significant breakthroughs in humanoid robot development, with robots performing complex assembly tasks and interacting naturally with environments.',
        impact: 'Humanoid Robotics',
        image: '🤖'
    }
];

const ComponentHistory = {
    resistor: {
        name: 'Resistor',
        invented: '1831',
        description: 'The concept of electrical resistance was first discovered by Georg Ohm. Physical resistors were first manufactured in the late 1800s.',
        milestones: [
            { year: 1831, event: 'Georg Ohm discovers Ohms Law' },
            { year: 1870, event: 'Carbon resistors first manufactured' },
            { year: 1924, event: 'Film resistors developed' },
            { year: 1960, event: 'SMD (Surface Mount Device) resistors invented' }
        ]
    },
    capacitor: {
        name: 'Capacitor',
        invented: '1746',
        description: 'The Leyden jar, the first capacitor, was invented independently by Ewald Georg von Kleist and Pieter van Musschenbroek.',
        milestones: [
            { year: 1746, event: 'Leyden jar invented' },
            { year: 1900, event: 'Paper capacitors manufactured' },
            { year: 1956, event: 'Electrolytic capacitors developed' },
            { year: 1980, event: 'Supercapacitors invented' }
        ]
    },
    transistor: {
        name: 'Transistor',
        invented: '1947',
        description: 'Invented at Bell Labs by John Bardeen, Leon Cooper, and Robert Schrieffer. Replaced vacuum tubes and enabled miniaturization of electronics.',
        milestones: [
            { year: 1947, event: 'First transistor demonstrated' },
            { year: 1954, event: 'Silicon transistors created' },
            { year: 1960, event: 'MOSFET (Metal-Oxide-Semiconductor Field-Effect Transistor) invented' },
            { year: 1990, event: 'Submicron transistors in mass production' }
        ]
    },
    diode: {
        name: 'Diode',
        invented: '1874',
        description: 'Ferdinand Braun discovered the rectifying property of point-contact between metals and crystal. First electronic component used to control current flow.',
        milestones: [
            { year: 1874, event: 'Crystal rectifier discovered' },
            { year: 1904, event: 'Vacuum tube diode invented' },
            { year: 1948, event: 'Semiconductor diode developed' },
            { year: 1962, event: 'LED (Light Emitting Diode) invented' }
        ]
    },
    microcontroller: {
        name: 'Microcontroller',
        invented: '1971',
        description: 'Intel 4004, the first microprocessor, led to the development of microcontrollers. Enabled programmable electronic devices and robotics.',
        milestones: [
            { year: 1971, event: 'Intel 4004 microprocessor released' },
            { year: 1981, event: 'Intel 8051 microcontroller introduced' },
            { year: 2005, event: 'Arduino microcontroller platform launched' },
            { year: 2015, event: 'IoT microcontrollers with WiFi capability' }
        ]
    }
};

const Tutorials = [
    {
        id: 1,
        title: 'Build Your First LED Circuit',
        difficulty: 'Beginner',
        time: '10 min',
        description: 'Learn how to light up an LED using a battery, resistor, and wire. Understand voltage drop and current limiting.',
        components: ['Battery', 'Resistor', 'LED', 'Wire'],
        steps: [
            'Connect positive terminal of battery to resistor',
            'Connect resistor to positive leg of LED',
            'Connect negative leg of LED to negative terminal of battery',
            'Observe the LED lighting up'
        ]
    },
    {
        id: 2,
        title: 'Series vs Parallel Circuits',
        difficulty: 'Beginner',
        time: '15 min',
        description: 'Explore the differences between series and parallel circuit configurations and how they affect voltage and current.',
        components: ['Battery', 'Resistor', 'LED', 'Wire'],
        steps: [
            'Build a series circuit with two LEDs',
            'Build a parallel circuit with two LEDs',
            'Compare brightness in both configurations',
            'Understand why they differ'
        ]
    },
    {
        id: 3,
        title: 'Arduino LED Control',
        difficulty: 'Intermediate',
        time: '20 min',
        description: 'Use Arduino to control an LED, learning about digital outputs and PWM (Pulse Width Modulation) for brightness control.',
        components: ['Arduino UNO', 'LED', 'Resistor', 'Breadboard', 'Jumper Wires'],
        steps: [
            'Connect LED to Arduino digital pin with resistor',
            'Write code to blink the LED',
            'Use PWM to control brightness',
            'Create a fading effect'
        ]
    },
    {
        id: 4,
        title: 'Servo Motor Control',
        difficulty: 'Intermediate',
        time: '25 min',
        description: 'Control a servo motor position using Arduino. Learn about PWM pulse control for precise angle positioning.',
        components: ['Arduino UNO', 'Servo Motor', 'Breadboard', 'Jumper Wires', 'Power Supply'],
        steps: [
            'Connect servo to Arduino with power and signal',
            'Write servo control library code',
            'Move servo through 0-180 degree range',
            'Create smooth sweeping motion'
        ]
    },
    {
        id: 5,
        title: 'Temperature Monitoring System',
        difficulty: 'Intermediate',
        time: '30 min',
        description: 'Build a temperature monitoring system using a temperature sensor and display readings on Arduino.',
        components: ['Arduino UNO', 'Temperature Sensor (LM35)', 'Breadboard', 'Jumper Wires', 'Resistor'],
        steps: [
            'Connect temperature sensor to Arduino analog input',
            'Read analog values and convert to temperature',
            'Display temperature in serial monitor',
            'Create temperature threshold alerts'
        ]
    },
    {
        id: 6,
        title: 'Distance Measurement with Ultrasonic Sensor',
        difficulty: 'Advanced',
        time: '35 min',
        description: 'Build an ultrasonic distance measurement system that detects objects and displays distance.',
        components: ['Arduino UNO', 'Ultrasonic Sensor (HC-SR04)', 'LED', 'Breadboard', 'Jumper Wires'],
        steps: [
            'Connect ultrasonic sensor trigger and echo pins',
            'Send ultrasonic pulses and measure echo time',
            'Calculate distance from travel time',
            'Light LED when object is close'
        ]
    },
    {
        id: 7,
        title: 'Building a Simple Robot',
        difficulty: 'Advanced',
        time: '120 min',
        description: 'Combine motors, sensors, and Arduino to build an autonomous obstacle-avoiding robot.',
        components: ['Arduino UNO', 'DC Motors', 'Ultrasonic Sensor', 'Motor Driver', 'Breadboard', 'Robot Chassis'],
        steps: [
            'Assemble robot chassis with motors',
            'Connect motor driver to Arduino',
            'Attach ultrasonic sensor',
            'Program autonomous navigation',
            'Test and calibrate movements'
        ]
    },
    {
        id: 8,
        title: 'IoT Data Logger',
        difficulty: 'Advanced',
        time: '60 min',
        description: 'Create a WiFi-enabled data logger that collects sensor data and sends it to cloud.',
        components: ['Arduino/ESP32', 'Multiple Sensors', 'WiFi Module', 'OLED Display'],
        steps: [
            'Connect multiple sensors',
            'Enable WiFi connectivity',
            'Set up cloud API connection',
            'Log and visualize data',
            'Create web dashboard'
        ]
    }
];

/**
 * Get history timeline
 */
function getHistoryTimeline() {
    return RoboticsHistory;
}

/**
 * Get component history
 */
function getComponentHistory(componentType) {
    return ComponentHistory[componentType];
}

/**
 * Get all tutorials
 */
function getAllTutorials() {
    return Tutorials;
}

/**
 * Get tutorial by ID
 */
function getTutorial(id) {
    return Tutorials.find(t => t.id === id);
}