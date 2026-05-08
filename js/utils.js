/**
 * Utility Functions
 * Common helper functions for the circuit simulator
 */

const Utils = {
    /**
     * Generate a unique ID
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    },

    /**
     * Clamp a value between min and max
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    },

    /**
     * Distance between two points
     */
    distance(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },

    /**
     * Check if point is inside rectangle
     */
    pointInRect(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },

    /**
     * Interpolate between two values
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    },

    /**
     * Format number to fixed decimal places
     */
    formatNumber(num, decimals = 2) {
        return Number(num.toFixed(decimals));
    },

    /**
     * Format voltage display
     */
    formatVoltage(voltage) {
        if (Math.abs(voltage) < 0.001) return '0V';
        if (Math.abs(voltage) < 1) return `${(voltage * 1000).toFixed(2)}mV`;
        return `${voltage.toFixed(2)}V`;
    },

    /**
     * Format current display
     */
    formatCurrent(current) {
        if (Math.abs(current) < 0.001) return '0mA';
        if (Math.abs(current) < 1) return `${(current * 1000).toFixed(2)}mA`;
        return `${(current * 1000).toFixed(2)}A`;
    },

    /**
     * Format power display
     */
    formatPower(power) {
        if (Math.abs(power) < 0.001) return '0mW';
        if (Math.abs(power) < 1) return `${(power * 1000).toFixed(2)}mW`;
        return `${power.toFixed(2)}W`;
    },

    /**
     * Format resistance display
     */
    formatResistance(resistance) {
        if (resistance === 0) return '0Ω';
        if (resistance < 1) return `${(resistance * 1000).toFixed(2)}mΩ`;
        if (resistance < 1000) return `${resistance.toFixed(2)}Ω`;
        if (resistance < 1000000) return `${(resistance / 1000).toFixed(2)}kΩ`;
        return `${(resistance / 1000000).toFixed(2)}MΩ`;
    },

    /**
     * Parse resistance value (e.g., "10k" -> 10000)
     */
    parseResistance(str) {
        const multipliers = {
            'Ω': 1,
            'k': 1000,
            'K': 1000,
            'M': 1000000,
            'm': 0.001
        };

        const match = str.match(/^([0-9.]+)\s*([kKMmΩ]?)/);
        if (!match) return 0;

        const value = parseFloat(match[1]);
        const unit = match[2] || 'Ω';
        return value * (multipliers[unit] || 1);
    },

    /**
     * Debounce function
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    /**
     * Throttle function
     */
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },

    /**
     * Deep clone object
     */
    deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    },

    /**
     * Merge objects
     */
    merge(target, ...sources) {
        sources.forEach(source => {
            for (const key in source) {
                if (source.hasOwnProperty(key)) {
                    target[key] = source[key];
                }
            }
        });
        return target;
    },

    /**
     * Convert degrees to radians
     */
    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    },

    /**
     * Convert radians to degrees
     */
    toDegrees(radians) {
        return radians * (180 / Math.PI);
    },

    /**
     * Calculate angle between two points
     */
    angle(x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    /**
     * Get random item from array
     */
    random(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    },

    /**
     * Shuffle array
     */
    shuffle(arr) {
        const shuffled = [...arr];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
};