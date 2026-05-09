/**
 * Enhanced Component Library with Detailed 2D Models
 * Complete robotics and electronics component database
 */

const DetailedComponents = {
    // BASIC COMPONENTS
    [ComponentTypes.RESISTOR]: {
        name: 'Resistor',
        type: ComponentTypes.RESISTOR,
        width: 100,
        height: 40,
        terminals: 2,
        properties: {
            resistance: { value: 1000, unit: 'Ω', min: 0.1, max: 10000000 },
            tolerance: { value: 5, unit: '%', min: 0.1, max: 20 },
            powerRating: { value: 0.25, unit: 'W', min: 0.125, max: 2 }
        },
        description: 'Resistor - Limits current and dissipates power',
        icon: 'resistor',
        color: '#FFB347',
        powerRating: 0.25,
        draw: function(ctx, x, y, w, h, isDamaged) {
            // Draw resistor body
            ctx.fillStyle = '#FFB347';
            ctx.fillRect(x + 20, y + 12, 60, 16);
            
            // Draw zigzag pattern
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#333';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + 15, y + 20);
            for (let i = 0; i < 5; i++) {
                ctx.lineTo(x + 25 + i * 12, y + (i % 2 === 0 ? 15 : 25));
            }
            ctx.lineTo(x + 85, y + 20);
            ctx.stroke();
            
            // Draw terminals
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y + 20);
            ctx.lineTo(x + 15, y + 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 85, y + 20);
            ctx.lineTo(x + 100, y + 20);
            ctx.stroke();
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('R', x + w / 2, y + h - 8);
        }
    },

    [ComponentTypes.CAPACITOR]: {
        name: 'Capacitor',
        type: ComponentTypes.CAPACITOR,
        width: 90,
        height: 40,
        terminals: 2,
        properties: {
            capacitance: { value: 0.000001, unit: 'F', min: 1e-12, max: 1 },
            voltage: { value: 16, unit: 'V', min: 1, max: 1000 },
            type: { value: 'ceramic', options: ['ceramic', 'electrolytic', 'film'] }
        },
        description: 'Capacitor - Stores electrical charge',
        icon: 'capacitor',
        color: '#87CEEB',
        energyStorage: true,
        draw: function(ctx, x, y, w, h, isDamaged) {
            // Draw capacitor body
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(x + 20, y + 8, 50, 24);
            
            // Draw plates
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#333';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x + 40, y + 5);
            ctx.lineTo(x + 40, y + 35);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 50, y + 5);
            ctx.lineTo(x + 50, y + 35);
            ctx.stroke();
            
            // Draw terminals
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x, y + 20);
            ctx.lineTo(x + 20, y + 20);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 70, y + 20);
            ctx.lineTo(x + 90, y + 20);
            ctx.stroke();
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('C', x + w / 2, y + h - 8);
        }
    },

    [ComponentTypes.LED]: {
        name: 'LED',
        type: ComponentTypes.LED,
        width: 70,
        height: 70,
        terminals: 2,
        properties: {
            color: { value: 'red', options: ['red', 'green', 'blue', 'yellow', 'white', 'amber'] },
            forwardVoltage: { value: 2.0, unit: 'V', min: 1.5, max: 3.5 },
            maxCurrent: { value: 0.02, unit: 'A', min: 0.005, max: 0.1 },
            brightness: { value: 100, unit: '%', min: 0, max: 100 }
        },
        description: 'LED - Light Emitting Diode',
        icon: 'led',
        isOutput: true,
        draw: function(ctx, x, y, w, h, isDamaged, isLit) {
            // Draw LED bulb
            const colorMap = {
                red: '#FF0000',
                green: '#00FF00',
                blue: '#0000FF',
                yellow: '#FFFF00',
                white: '#FFFFFF',
                amber: '#FFBF00'
            };
            
            // Draw LED body
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 20, 12, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw LED glow when lit
            if (isLit && !isDamaged) {
                const color = colorMap[this.properties.color.value] || '#FF0000';
                ctx.fillStyle = color;
                ctx.globalAlpha = 0.6;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + 20, 18, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1.0;
                
                // Draw bright center
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + 20, 10, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw terminals and legs
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w / 2 - 3, y + 32);
            ctx.lineTo(x + w / 2 - 8, y + h - 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w / 2 + 3, y + 32);
            ctx.lineTo(x + w / 2 + 8, y + h - 5);
            ctx.stroke();
            
            // Draw cathode marking
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 20, 11, -0.3, 0.3);
            ctx.stroke();
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('LED', x + w / 2, y + h - 2);
        }
    },

    [ComponentTypes.BATTERY]: {
        name: 'Battery',
        type: ComponentTypes.BATTERY,
        width: 50,
        height: 90,
        terminals: 2,
        properties: {
            voltage: { value: 5, unit: 'V', min: 1.5, max: 48 },
            capacity: { value: 2000, unit: 'mAh', min: 100, max: 100000 },
            type: { value: 'AAA', options: ['AA', 'AAA', '9V', 'Lithium'] }
        },
        description: 'Battery - Power source',
        icon: 'battery',
        color: '#FF6B6B',
        isPowerSource: true,
        draw: function(ctx, x, y, w, h, isDamaged) {
            // Draw battery body
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 8, y + 10, 34, 65);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 8, y + 10, 34, 65);
            
            // Draw positive terminal (top)
            ctx.fillStyle = '#FFD700';
            ctx.fillRect(x + 18, y + 2, 14, 8);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 18, y + 2, 14, 8);
            
            // Draw negative terminal (bump)
            ctx.fillStyle = '#C0C0C0';
            ctx.beginPath();
            ctx.arc(x + 25, y + 5, 3, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Draw + and - signs
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('+', x + 25, y + 35);
            ctx.font = 'bold 24px Arial';
            ctx.fillText('−', x + 25, y + 65);
            
            // Draw voltage label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(this.properties.voltage.value + 'V', x + 25, y + h - 5);
        }
    },

    [ComponentTypes.SWITCH]: {
        name: 'Switch',
        type: ComponentTypes.SWITCH,
        width: 80,
        height: 50,
        terminals: 2,
        properties: {
            state: { value: false, type: 'boolean' },
            resistance: { value: 0.01, unit: 'Ω', min: 0, max: 1 },
            type: { value: 'toggle', options: ['toggle', 'pushbutton', 'slide'] }
        },
        description: 'Switch - Opens/closes circuit',
        icon: 'switch',
        color: '#A8D8EA',
        isInteractive: true,
        draw: function(ctx, x, y, w, h, isDamaged, state) {
            // Draw switch body
            ctx.fillStyle = '#CCC';
            ctx.beginPath();
            ctx.roundRect(x + 10, y + 15, 60, 20, 5);
            ctx.fill();
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#333';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw toggle lever
            ctx.save();
            ctx.translate(x + 20, y + 25);
            if (state) {
                ctx.rotate(Math.PI / 6);
            } else {
                ctx.rotate(-Math.PI / 6);
            }
            ctx.fillStyle = '#555';
            ctx.fillRect(-4, -20, 8, 20);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-4, -20, 8, 20);
            ctx.restore();
            
            // Draw terminals
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x, y + 25);
            ctx.lineTo(x + 10, y + 25);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 70, y + 25);
            ctx.lineTo(x + 80, y + 25);
            ctx.stroke();
            
            // Draw state indicator
            ctx.fillStyle = state ? '#00FF00' : '#FF0000';
            ctx.beginPath();
            ctx.arc(x + 40, y + h - 5, 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(state ? 'ON' : 'OFF', x + 40, y + h - 3);
        }
    },

    [ComponentTypes.ARDUINO_UNO]: {
        name: 'Arduino UNO',
        type: ComponentTypes.ARDUINO_UNO,
        width: 140,
        height: 190,
        terminals: 30,
        properties: {
            voltage: { value: 5, unit: 'V' },
            clockSpeed: { value: 16, unit: 'MHz' },
            flash: { value: 32, unit: 'KB' }
        },
        description: 'Arduino UNO - Microcontroller board',
        icon: 'arduino',
        color: '#00A4EF',
        isController: true,
        draw: function(ctx, x, y, w, h, isDamaged, isPowered) {
            // Draw main PCB (blue)
            ctx.fillStyle = '#00A4EF';
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#0081B4';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
            
            // Draw USB port
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 40, y - 8, 30, 8);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 40, y - 8, 30, 8);
            
            // Draw power jack
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(x + 25, y + 15, 6, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            
            // Draw chip (microcontroller)
            ctx.fillStyle = '#000';
            ctx.fillRect(x + 50, y + 50, 40, 40);
            ctx.strokeStyle = '#666';
            ctx.lineWidth = 1;
            ctx.strokeRect(x + 50, y + 50, 40, 40);
            
            // Draw power LED
            ctx.fillStyle = isPowered ? '#00FF00' : '#333';
            ctx.beginPath();
            ctx.arc(x + 15, y + 30, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw TX LED (blinking when powered)
            const blinkState = isPowered && Math.sin(Date.now() / 100) > 0;
            ctx.fillStyle = blinkState ? '#FFFF00' : '#333';
            ctx.beginPath();
            ctx.arc(x + 20, y + 30, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw RX LED (blinking when powered)
            ctx.fillStyle = blinkState ? '#FF0000' : '#333';
            ctx.beginPath();
            ctx.arc(x + 25, y + 30, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw digital pins (left side)
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            for (let i = 0; i < 8; i++) {
                const pinY = y + 100 + i * 10;
                ctx.beginPath();
                ctx.arc(x - 2, pinY, 2.5, 0, Math.PI * 2);
                ctx.stroke();
                
                // Pin labels
                ctx.fillStyle = '#FFF';
                ctx.font = '7px Arial';
                ctx.textAlign = 'right';
                ctx.fillText(`D${i}`, x - 8, pinY + 2);
            }
            
            // Draw analog pins (right side)
            for (let i = 0; i < 6; i++) {
                const pinY = y + 100 + i * 10;
                ctx.beginPath();
                ctx.arc(x + w + 2, pinY, 2.5, 0, Math.PI * 2);
                ctx.stroke();
                
                // Pin labels
                ctx.fillStyle = '#FFF';
                ctx.font = '7px Arial';
                ctx.textAlign = 'left';
                ctx.fillText(`A${i}`, x + w + 8, pinY + 2);
            }
            
            // Draw power pins (bottom)
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(x + 30, y + h - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FF0000';
            ctx.beginPath();
            ctx.arc(x + 50, y + h - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#000';
            ctx.beginPath();
            ctx.arc(x + 70, y + h - 2, 2.5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw label
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('ARDUINO', x + w / 2, y + h / 2 + 5);
            ctx.font = '8px Arial';
            ctx.fillText('UNO', x + w / 2, y + h / 2 + 18);
        }
    },

    [ComponentTypes.BREADBOARD]: {
        name: 'Breadboard',
        type: ComponentTypes.BREADBOARD,
        width: 220,
        height: 280,
        terminals: 60,
        properties: {
            rows: { value: 30, unit: 'rows' },
            columns: { value: 5, unit: 'columns' },
            type: { value: 'standard', options: ['standard', 'mini', 'power'] }
        },
        description: 'Breadboard - Solderless prototyping',
        icon: 'breadboard',
        color: '#FFB6B9',
        isBoard: true,
        draw: function(ctx, x, y, w, h, isDamaged) {
            // Draw main body
            ctx.fillStyle = '#FFB6B9';
            ctx.fillRect(x, y, w, h);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, w, h);
            
            // Draw power rails (red and blue strips)
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(x + 10, y + 10, 12, h - 20);
            ctx.fillStyle = '#0000FF';
            ctx.fillRect(x + w - 22, y + 10, 12, h - 20);
            
            // Draw power strip labels
            ctx.fillStyle = '#FFF';
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('+', x + 16, y + 20);
            ctx.fillText('−', x + w - 16, y + 20);
            
            // Draw individual holes grid (5 columns, 30 rows)
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            const holeRadius = 2;
            const spacingX = (w - 60) / 5;
            const spacingY = (h - 40) / 30;
            
            for (let row = 0; row < 30; row++) {
                for (let col = 0; col < 5; col++) {
                    const holeX = x + 30 + col * spacingX;
                    const holeY = y + 20 + row * spacingY;
                    
                    ctx.fillStyle = '#333';
                    ctx.beginPath();
                    ctx.arc(holeX, holeY, holeRadius, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
            
            // Draw power holes
            for (let row = 0; row < 30; row++) {
                const holeY = y + 20 + row * spacingY;
                // Positive rail
                ctx.fillStyle = '#FF4444';
                ctx.beginPath();
                ctx.arc(x + 16, holeY, holeRadius, 0, Math.PI * 2);
                ctx.fill();
                // Negative rail
                ctx.fillStyle = '#4444FF';
                ctx.beginPath();
                ctx.arc(x + w - 16, holeY, holeRadius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Breadboard', x + w / 2, y + h - 10);
        }
    },

    [ComponentTypes.SERVO_MOTOR]: {
        name: 'Servo Motor',
        type: ComponentTypes.SERVO_MOTOR,
        width: 80,
        height: 110,
        terminals: 3,
        properties: {
            voltage: { value: 5, unit: 'V', min: 3, max: 6 },
            torque: { value: 2.5, unit: kg·cm', min: 1, max: 10 },
            speed: { value: 60, unit: 'deg/sec', min: 30, max: 300 },
            angle: { value: 90, unit: 'deg', min: 0, max: 180 }
        },
        description: 'Servo Motor - Controlled position rotation',
        icon: 'servo',
        color: '#AA96DA',
        isActuator: true,
        draw: function(ctx, x, y, w, h, isDamaged, angle) {
            // Draw servo case
            ctx.fillStyle = '#333';
            ctx.fillRect(x, y + 20, w, 50);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y + 20, w, 50);
            
            // Draw output shaft
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y + 20);
            ctx.lineTo(x + w / 2, y + 15);
            ctx.stroke();
            
            // Draw rotating horn
            ctx.save();
            ctx.translate(x + w / 2, y + 15);
            ctx.rotate((angle || 90) * Math.PI / 180);
            ctx.fillStyle = '#555';
            ctx.fillRect(-4, -20, 8, 20);
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(-4, -20, 8, 20);
            ctx.restore();
            
            // Draw servo terminals
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x + w / 4, y + h - 5);
            ctx.lineTo(x + w / 4, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y + h - 5);
            ctx.lineTo(x + w / 2, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 3 * w / 4, y + h - 5);
            ctx.lineTo(x + 3 * w / 4, y + h);
            ctx.stroke();
            
            // Draw servo connector
            ctx.fillStyle = '#FFB6B9';
            ctx.fillRect(x + 10, y + h - 8, w - 20, 8);
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x + 10, y + h - 8, w - 20, 8);
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Servo', x + w / 2, y + 70);
        }
    },

    [ComponentTypes.DC_MOTOR]: {
        name: 'DC Motor',
        type: ComponentTypes.DC_MOTOR,
        width: 70,
        height: 100,
        terminals: 2,
        properties: {
            voltage: { value: 5, unit: 'V', min: 3, max: 12 },
            current: { value: 0.5, unit: 'A', min: 0.1, max: 2 },
            speed: { value: 10000, unit: 'RPM', min: 1000, max: 30000 },
            torque: { value: 0.1, unit: 'Nm', min: 0.05, max: 1 }
        },
        description: 'DC Motor - High-speed rotation',
        icon: 'motor',
        color: '#FF6B6B',
        isActuator: true,
        draw: function(ctx, x, y, w, h, isDamaged, isRunning) {
            // Draw motor body (cylinder)
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 5, y + 20, w - 10, 40);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 5, y + 20, w - 10, 40);
            
            // Draw motor end caps
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 20, 15, 0, Math.PI);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 60, 15, Math.PI, Math.PI * 2);
            ctx.fill();
            
            // Draw rotating shaft with visual rotation
            ctx.save();
            if (isRunning) {
                ctx.translate(x + w / 2, y + 20);
                ctx.rotate(Date.now() / 50);
                ctx.fillStyle = '#888';
                ctx.fillRect(-3, -8, 6, 8);
            } else {
                ctx.fillStyle = '#888';
                ctx.fillRect(x + w / 2 - 3, y + 12, 6, 8);
            }
            ctx.restore();
            
            // Draw terminals
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x, y + 30);
            ctx.lineTo(x + 5, y + 30);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w, y + 50);
            ctx.lineTo(x + w - 5, y + 50);
            ctx.stroke();
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Motor', x + w / 2, y + h - 5);
        }
    },

    [ComponentTypes.TEMP_SENSOR]: {
        name: 'Temperature Sensor (LM35)',
        type: ComponentTypes.TEMP_SENSOR,
        width: 60,
        height: 100,
        terminals: 3,
        properties: {
            type: { value: 'LM35', options: ['LM35', 'DHT11', 'DS18B20'] },
            minTemp: { value: -40, unit: '°C' },
            maxTemp: { value: 125, unit: '°C' },
            accuracy: { value: 0.5, unit: '°C' },
            currentReading: { value: 25, unit: '°C' }
        },
        description: 'Temperature Sensor - Measures heat',
        icon: 'sensor',
        color: '#FCBAD3',
        isSensor: true,
        draw: function(ctx, x, y, w, h, isDamaged, reading) {
            // Draw sensor body
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 10, y + 10, w - 20, 40);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 10, y + 10, w - 20, 40);
            
            // Draw thermometer bulb
            ctx.fillStyle = '#FF6B6B';
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 55, 5, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw thermometer tube
            ctx.strokeStyle = '#FF6B6B';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y + 50);
            ctx.lineTo(x + w / 2, y + 15);
            ctx.stroke();
            
            // Draw terminals (VCC, GND, OUT)
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w / 4, y + h - 5);
            ctx.lineTo(x + w / 4, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y + h - 5);
            ctx.lineTo(x + w / 2, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 3 * w / 4, y + h - 5);
            ctx.lineTo(x + 3 * w / 4, y + h);
            ctx.stroke();
            
            // Display temperature reading
            ctx.fillStyle = '#333';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(reading || 25)}°C`, x + w / 2, y + 35);
            
            // Draw sensor label
            ctx.font = 'bold 8px Arial';
            ctx.fillText('LM35', x + w / 2, y + h - 10);
        }
    },

    [ComponentTypes.DISTANCE_SENSOR]: {
        name: 'Ultrasonic Sensor (HC-SR04)',
        type: ComponentTypes.DISTANCE_SENSOR,
        width: 100,
        height: 80,
        terminals: 4,
        properties: {
            type: { value: 'HC-SR04', options: ['HC-SR04', 'VL53L0X'] },
            minRange: { value: 2, unit: 'cm' },
            maxRange: { value: 400, unit: 'cm' },
            frequency: { value: 40, unit: 'kHz' },
            currentDistance: { value: 30, unit: 'cm' }
        },
        description: 'Ultrasonic Sensor - Measures distance',
        icon: 'sensor',
        color: '#A7FFEB',
        isSensor: true,
        draw: function(ctx, x, y, w, h, isDamaged, distance) {
            // Draw sensor body
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 10, y + 10, w - 20, 30);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 10, y + 10, w - 20, 30);
            
            // Draw two transducers
            ctx.fillStyle = '#CCC';
            ctx.beginPath();
            ctx.arc(x + 25, y + 25, 7, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(x + w - 25, y + 25, 7, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw ultrasonic waves
            ctx.strokeStyle = '#0FF';
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            for (let i = 1; i <= 3; i++) {
                const waveRadius = 8 + i * 6;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + 25, waveRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.globalAlpha = 1.0;
            
            // Draw terminals
            const terminalX = [x + 15, x + 35, x + 65, x + w - 15];
            const labels = ['VCC', 'TRIG', 'ECHO', 'GND'];
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            terminalX.forEach((tx, i) => {
                ctx.beginPath();
                ctx.moveTo(tx, y + 40);
                ctx.lineTo(tx, y + h - 5);
                ctx.stroke();
                
                // Terminal label
                ctx.fillStyle = '#333';
                ctx.font = '7px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(labels[i], tx, y + h - 1);
            });
            
            // Display distance reading
            ctx.fillStyle = '#333';
            ctx.font = 'bold 9px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(`${Math.round(distance || 30)}cm`, x + w / 2, y + h - 15);
        }
    },

    [ComponentTypes.MOTION_SENSOR]: {
        name: 'Motion Sensor (PIR)',
        type: ComponentTypes.MOTION_SENSOR,
        width: 70,
        height: 80,
        terminals: 3,
        properties: {
            type: { value: 'PIR', options: ['PIR', 'Microwave'] },
            sensitivity: { value: 50, unit: '%', min: 0, max: 100 },
            delay: { value: 2, unit: 'sec', min: 0.5, max: 10 },
            range: { value: 7, unit: 'meters' },
            motionDetected: { value: false, type: 'boolean' }
        },
        description: 'Motion Sensor - Detects movement',
        icon: 'sensor',
        color: '#FFE0B2',
        isSensor: true,
        draw: function(ctx, x, y, w, h, isDamaged, detected) {
            // Draw sensor body
            ctx.fillStyle = '#F5DEB3';
            ctx.fillRect(x + 5, y + 5, w - 10, h - 15);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#333';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 5, y + 5, w - 10, h - 15);
            
            // Draw Fresnel lens
            ctx.fillStyle = '#DDD';
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 15, 8, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw lens segments
            ctx.strokeStyle = '#999';
            ctx.lineWidth = 1;
            for (let i = 0; i < 6; i++) {
                ctx.beginPath();
                ctx.arc(x + w / 2, y + 15, 5 - i, 0, Math.PI * 2);
                ctx.stroke();
            }
            
            // Draw motion detection indicator
            ctx.fillStyle = detected ? '#FF0000' : '#999';
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 40, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw terminals
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w / 4, y + h - 10);
            ctx.lineTo(x + w / 4, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y + h - 10);
            ctx.lineTo(x + w / 2, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 3 * w / 4, y + h - 10);
            ctx.lineTo(x + 3 * w / 4, y + h);
            ctx.stroke();
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('PIR', x + w / 2, y + h - 2);
        }
    },

    [ComponentTypes.LIGHT_SENSOR]: {
        name: 'Light Sensor (LDR)',
        type: ComponentTypes.LIGHT_SENSOR,
        width: 60,
        height: 60,
        terminals: 2,
        properties: {
            resistance: { value: 10000, unit: 'Ω', min: 100, max: 1000000 },
            lightLevel: { value: 500, unit: 'lux', min: 0, max: 100000 }
        },
        description: 'Light Sensor - Detects light levels',
        icon: 'sensor',
        color: '#FFEB3B',
        isSensor: true,
        draw: function(ctx, x, y, w, h, isDamaged, lightLevel) {
            // Draw sensor body
            ctx.fillStyle = '#333';
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, 20, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#000';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            // Draw light sensitive area
            const brightness = (lightLevel || 500) / 100000;
            ctx.fillStyle = `rgba(255, 200, 0, ${brightness})`;
            ctx.beginPath();
            ctx.arc(x + w / 2, y + h / 2, 18, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw light rays
            ctx.strokeStyle = '#FFEB3B';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = brightness;
            for (let i = 0; i < 4; i++) {
                const angle = (i / 4) * Math.PI * 2;
                const startX = x + w / 2 + Math.cos(angle) * 20;
                const startY = y + h / 2 + Math.sin(angle) * 20;
                const endX = x + w / 2 + Math.cos(angle) * 35;
                const endY = y + h / 2 + Math.sin(angle) * 35;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }
            ctx.globalAlpha = 1.0;
            
            // Draw terminals
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(x + w / 4, y + h - 2);
            ctx.lineTo(x + w / 4, y + h + 5);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 3 * w / 4, y + h - 2);
            ctx.lineTo(x + 3 * w / 4, y + h + 5);
            ctx.stroke();
        }
    },

    [ComponentTypes.SOUND_SENSOR]: {
        name: 'Sound Sensor',
        type: ComponentTypes.SOUND_SENSOR,
        width: 60,
        height: 70,
        terminals: 3,
        properties: {
            sensitivity: { value: 50, unit: '%', min: 0, max: 100 },
            frequency: { value: 5000, unit: 'Hz', min: 20, max: 20000 },
            soundLevel: { value: 0, unit: 'dB', min: 0, max: 120 }
        },
        description: 'Sound Sensor - Detects sound levels',
        icon: 'sensor',
        color: '#B39DDB',
        isSensor: true,
        draw: function(ctx, x, y, w, h, isDamaged, soundLevel) {
            // Draw sensor body
            ctx.fillStyle = '#333';
            ctx.fillRect(x + 10, y + 10, w - 20, 35);
            ctx.strokeStyle = isDamaged ? '#ff0000' : '#000';
            ctx.lineWidth = 2;
            ctx.strokeRect(x + 10, y + 10, w - 20, 35);
            
            // Draw microphone/speaker opening
            ctx.fillStyle = '#666';
            ctx.beginPath();
            ctx.arc(x + w / 2, y + 27, 6, 0, Math.PI * 2);
            ctx.fill();
            
            // Draw sound waves
            const level = (soundLevel || 0) / 120;
            ctx.strokeStyle = '#9C27B0';
            ctx.lineWidth = 1.5;
            ctx.globalAlpha = 0.6;
            for (let i = 1; i <= 3; i++) {
                const waveRadius = 10 + i * 5 * level;
                ctx.beginPath();
                ctx.arc(x + w / 2, y + 27, waveRadius, 0, Math.PI * 2);
                ctx.stroke();
            }
            ctx.globalAlpha = 1.0;
            
            // Draw terminals
            ctx.strokeStyle = '#888';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x + w / 4, y + h - 10);
            ctx.lineTo(x + w / 4, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w / 2, y + h - 10);
            ctx.lineTo(x + w / 2, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 3 * w / 4, y + h - 10);
            ctx.lineTo(x + 3 * w / 4, y + h);
            ctx.stroke();
            
            // Draw label
            ctx.fillStyle = '#333';
            ctx.font = 'bold 8px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('Sound', x + w / 2, y + h - 2);
        }
    }
};

// Update component library with detailed models
Object.assign(ComponentLibrary, DetailedComponents);