import { RecordManager } from '../storage/RecordManager.js';

export class RecordsScreen {
  constructor(onBack) {
    this._container = document.getElementById('screen-records');
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.id = 'screen-records';
      this._container.className = 'screen';
      document.body.appendChild(this._container);
    }

    this._onBack = onBack;
  }

  show(cars, tracks) {
    const all = RecordManager.getAll();

    const rows = tracks.flatMap(track =>
      cars.map(car => {
        const key = `race_best_${track.id}_${car.id}`;
        const record = all[key];
        const formatMs = (ms) => {
          const m = Math.floor(ms / 60000);
          const s = Math.floor((ms % 60000) / 1000);
          const ms2 = ms % 1000;
          return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms2).padStart(3, '0')}`;
        };

        return `
          <tr>
            <td>${track.name}</td>
            <td>${car.name}</td>
            <td>${record ? formatMs(record.totalRaceTimeMs) : '—'}</td>
            <td>${record ? formatMs(record.bestLapTimeMs) : '—'}</td>
          </tr>
        `;
      })
    ).join('');

    this._container.innerHTML = `
      <div class="screen-content">
        <h2>📊 成績記錄</h2>
        <div class="records-table-wrap">
          <table class="records-table">
            <thead>
              <tr>
                <th>賽道</th><th>賽車</th><th>完賽時間</th><th>最快圈</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <button class="menu-btn back-btn">返回主選單</button>
      </div>
    `;

    this._container.querySelector('.back-btn').addEventListener('click', () => this._onBack());
    this._container.style.display = 'flex';
  }

  hide() { this._container.style.display = 'none'; }
}
