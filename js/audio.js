/**
 * Audio Manager
 * Handles all sound effects and audio feedback
 */

const AudioManager = (() => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    let isMuted = false;

    return {
        /**
         * Toggle mute
         */
        setMute(muted) {
            isMuted = muted;
        },

        /**
         * Play success sound
         */
        playSuccess() {
            if (isMuted) return;
            this.playTone(800, 0.1, 150);
            setTimeout(() => this.playTone(1000, 0.1, 150), 100);
        },

        /**
         * Play error sound
         */
        playError() {
            if (isMuted) return;
            this.playTone(400, 0.1, 200);
            setTimeout(() => this.playTone(300, 0.1, 200), 150);
        },

        /**
         * Play click sound
         */
        playClick() {
            if (isMuted) return;
            this.playTone(600, 0.05, 50);
        },

        /**
         * Play power on sound
         */
        playPowerOn() {
            if (isMuted) return;
            this.playTone(400, 0.08, 100);
            setTimeout(() => this.playTone(600, 0.08, 100), 80);
            setTimeout(() => this.playTone(800, 0.08, 150), 150);
        },

        /**
         * Play power off sound
         */
        playPowerOff() {
            if (isMuted) return;
            this.playTone(800, 0.08, 100);
            setTimeout(() => this.playTone(600, 0.08, 100), 80);
            setTimeout(() => this.playTone(400, 0.08, 150), 150);
        },

        /**
         * Play beep sound
         */
        playBeep() {
            if (isMuted) return;
            this.playTone(500, 0.1, 100);
        },

        /**
         * Generic tone generator
         */
        playTone(frequency, volume, duration) {
            if (isMuted) return;
            
            const oscillator = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            oscillator.connect(gain);
            gain.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = 'sine';
            
            gain.gain.setValueAtTime(volume, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration / 1000);
        },

        /**
         * Play notification sound
         */
        playNotification() {
            if (isMuted) return;
            this.playTone(700, 0.1, 200);
        },

        /**
         * Play warning sound
         */
        playWarning() {
            if (isMuted) return;
            this.playTone(600, 0.1, 150);
            setTimeout(() => this.playTone(600, 0.1, 150), 200);
        }
    };
})();