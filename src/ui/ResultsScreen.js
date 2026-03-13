import { Timer } from '../utils/Timer.js';

export class ResultsScreen {
  constructor(onRetry, onMenu) {
    this._container = document.getElementById('screen-results');
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.id = 'screen-results';
      this._container.className = 'screen';
      document.body.appendChild(this._container);
    }

    this._onRetry = onRetry;
    this._onMenu = onMenu;
  }

  show({ totalRaceTimeMs, bestLapTimeMs, lapTimes, isNewRecord }) {
    const formatMs = (ms) => {
      const t = new Timer();
      t.start();
      t.tick(ms);
      t.stop();
      return t.format();
    };

    this._container.innerHTML = `
      <div class="screen-content results-content">
        <h2>🏁 完賽！</h2>
        ${isNewRecord ? '<p class="new-record">🏆 新紀錄！</p>' : ''}
        <div class="results-table">
          <div class="result-row">
            <span>完賽時間</span>
            <span>${formatMs(totalRaceTimeMs)}</span>
          </div>
          <div class="result-row">
            <span>最快單圈</span>
            <span>${formatMs(bestLapTimeMs)}</span>
          </div>
          ${lapTimes.map((t, i) => `
            <div class="result-row">
              <span>第 ${i + 1} 圈</span>
              <span>${formatMs(t)}</span>
            </div>
          `).join('')}
        </div>
        <div class="menu-buttons">
          <button id="btn-retry-results" class="menu-btn primary">再跑一次</button>
          <button id="btn-menu-results" class="menu-btn">返回主選單</button>
        </div>
      </div>
    `;

    this._container.querySelector('#btn-retry-results').addEventListener('click', () => this._onRetry());
    this._container.querySelector('#btn-menu-results').addEventListener('click', () => this._onMenu());
    this._container.style.display = 'flex';
  }

  hide() { this._container.style.display = 'none'; }
}
