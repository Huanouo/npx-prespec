export class PauseScreen {
  constructor(onResume, onRetry, onMenu) {
    this._container = document.getElementById('screen-pause');
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.id = 'screen-pause';
      this._container.className = 'screen overlay';
      document.body.appendChild(this._container);
    }

    this._container.innerHTML = `
      <div class="screen-content">
        <h2>⏸ 暫停</h2>
        <div class="menu-buttons">
          <button id="btn-resume" class="menu-btn primary">繼續</button>
          <button id="btn-retry-pause" class="menu-btn">重試</button>
          <button id="btn-menu-pause" class="menu-btn">返回主選單</button>
        </div>
      </div>
    `;

    this._container.querySelector('#btn-resume').addEventListener('click', () => onResume());
    this._container.querySelector('#btn-retry-pause').addEventListener('click', () => onRetry());
    this._container.querySelector('#btn-menu-pause').addEventListener('click', () => onMenu());
  }

  show() { this._container.style.display = 'flex'; }
  hide() { this._container.style.display = 'none'; }
}
