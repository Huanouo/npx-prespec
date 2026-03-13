export class AudioManager {
  #ctx = null;
  #ready = false;

  constructor() {
    const resume = () => {
      if (!this.#ctx) {
        try {
          this.#ctx = new (window.AudioContext || window.webkitAudioContext)();
        } catch {
          return;
        }
      }
      if (this.#ctx.state === 'suspended') {
        this.#ctx.resume().catch(() => {});
      }
      this.#ready = true;
    };

    window.addEventListener('click', resume, { once: true });
    window.addEventListener('keydown', resume, { once: true });
  }

  #playTone(frequency, duration, type = 'square') {
    if (!this.#ready || !this.#ctx) return;
    try {
      const osc = this.#ctx.createOscillator();
      const gain = this.#ctx.createGain();
      osc.connect(gain);
      gain.connect(this.#ctx.destination);
      osc.type = type;
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.3, this.#ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.#ctx.currentTime + duration);
      osc.start(this.#ctx.currentTime);
      osc.stop(this.#ctx.currentTime + duration);
    } catch {
      // Silently fail
    }
  }

  playCrash() {
    this.#playTone(120, 0.4, 'sawtooth');
  }

  playLapComplete() {
    this.#playTone(880, 0.2, 'sine');
    setTimeout(() => this.#playTone(1100, 0.3, 'sine'), 200);
  }

  dispose() {
    if (this.#ctx) {
      this.#ctx.close().catch(() => {});
      this.#ctx = null;
    }
  }
}
