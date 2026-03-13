export class MenuScreen {
  constructor(onStart, onRecords) {
    this._container = document.getElementById('screen-menu');
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.id = 'screen-menu';
      this._container.className = 'screen';
      document.body.appendChild(this._container);
    }

    this._container.innerHTML = `
      <div class="screen-content">
        <h1 class="game-title">🏎️ 第三人稱賽車遊戲</h1>
        <div class="menu-buttons">
          <button id="btn-start" class="menu-btn primary">開始遊戲</button>
          <button id="btn-records" class="menu-btn">查看記錄</button>
        </div>
      </div>
    `;

    this._container.querySelector('#btn-start').addEventListener('click', () => onStart());
    this._container.querySelector('#btn-records').addEventListener('click', () => onRecords());
  }

  show() { this._container.style.display = 'flex'; }
  hide() { this._container.style.display = 'none'; }
}
