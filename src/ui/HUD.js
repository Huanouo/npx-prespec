export class HUD {
  constructor() {
    this._container = document.getElementById('hud');
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.id = 'hud';
      document.body.appendChild(this._container);
    }

    this._speedEl = this._makeEl('hud-speed');
    this._lapEl = this._makeEl('hud-lap');
    this._timerEl = this._makeEl('hud-timer');
    this._lapTimeEl = this._makeEl('hud-lap-time');
    this._countdownEl = this._makeEl('hud-countdown');

    this._container.append(
      this._speedEl,
      this._lapEl,
      this._timerEl,
      this._lapTimeEl,
      this._countdownEl
    );
  }

  _makeEl(id) {
    const el = document.createElement('div');
    el.id = id;
    el.className = id;
    return el;
  }

  update({ speed, lap, totalLaps, time, lapTime, countdown, phase }) {
    this._speedEl.textContent = `${Math.round(speed * 200)} km/h`;
    this._lapEl.textContent = `圈數: ${lap} / ${totalLaps}`;
    this._timerEl.textContent = time;
    this._lapTimeEl.textContent = lapTime ? `當前圈: ${lapTime}` : '';

    if (phase === 'countdown' && countdown > 0) {
      this._countdownEl.textContent = countdown;
      this._countdownEl.style.display = 'block';
    } else if (phase === 'countdown' && countdown === 0) {
      this._countdownEl.textContent = 'GO!';
      this._countdownEl.style.display = 'block';
    } else {
      this._countdownEl.style.display = 'none';
    }
  }

  show() { this._container.style.display = 'block'; }
  hide() { this._container.style.display = 'none'; }
}
