export class SelectionScreen {
  constructor(containerId, title, items, onSelect, onBack) {
    this._container = document.getElementById(containerId);
    if (!this._container) {
      this._container = document.createElement('div');
      this._container.id = containerId;
      this._container.className = 'screen';
      document.body.appendChild(this._container);
    }

    this._render(title, items, onSelect, onBack);
  }

  _render(title, items, onSelect, onBack) {
    this._container.innerHTML = `
      <div class="screen-content">
        <h2>${title}</h2>
        <div class="selection-grid">
          ${items.map(item => `
            <div class="selection-card" data-id="${item.id}">
              <div class="card-thumbnail">
                <div class="placeholder-thumb" style="background:${this._colorForId(item.id)}"></div>
              </div>
              <div class="card-info">
                <h3>${item.name}</h3>
                ${item.difficulty ? `<span class="difficulty difficulty-${item.difficulty}">${this._difficultyLabel(item.difficulty)}</span>` : ''}
                ${item.maxSpeed ? `<p>最高速: ${Math.round(item.maxSpeed * 200)} km/h</p>` : ''}
                ${item.totalLaps ? `<p>圈數: ${item.totalLaps} 圈</p>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <button class="menu-btn back-btn">返回</button>
      </div>
    `;

    this._container.querySelectorAll('.selection-card').forEach(card => {
      card.addEventListener('click', () => onSelect(card.dataset.id));
    });
    this._container.querySelector('.back-btn').addEventListener('click', () => onBack());
  }

  _colorForId(id) {
    const colors = { car_01: '#ff3300', car_02: '#0066ff', car_03: '#ffcc00', track_01: '#4a7c59', track_02: '#7c4a4a' };
    return colors[id] || '#888';
  }

  _difficultyLabel(d) {
    return { easy: '簡單', medium: '中等', hard: '困難' }[d] || d;
  }

  show() { this._container.style.display = 'flex'; }
  hide() { this._container.style.display = 'none'; }
}
