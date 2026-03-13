import { describe, it, expect, beforeEach } from 'vitest';
import { SelectionScreen } from '../../src/ui/SelectionScreen.js';
import { CARS } from '../../src/data/cars.js';
import { TRACKS } from '../../src/data/tracks.js';

describe('SelectionScreen', () => {
  let carSelectedId = null;
  let backCalled = false;
  let screen;

  beforeEach(() => {
    document.body.innerHTML = '';
    carSelectedId = null;
    backCalled = false;
    screen = new SelectionScreen(
      'screen-car-select',
      '選擇賽車',
      CARS,
      (id) => { carSelectedId = id; },
      () => { backCalled = true; }
    );
  });

  it('renderCarList 顯示正確數量的賽車卡片', () => {
    const cards = document.querySelectorAll('.selection-card');
    expect(cards.length).toBe(CARS.length);
  });

  it('renderCarList 顯示正確賽車名稱', () => {
    const cards = document.querySelectorAll('.selection-card');
    const names = Array.from(cards).map(c => c.querySelector('h3').textContent);
    expect(names).toContain('閃電紅');
    expect(names).toContain('穩定藍');
    expect(names).toContain('均衡黃');
  });

  it('onCarSelected 回呼在點擊賽車卡片時被觸發，帶入正確 carId', () => {
    const firstCard = document.querySelector('.selection-card');
    firstCard.click();
    expect(carSelectedId).toBe(CARS[0].id);
  });

  it('點擊每張卡片觸發 onSelect 帶入對應 id', () => {
    const cards = document.querySelectorAll('.selection-card');
    cards.forEach((card, i) => {
      card.click();
      expect(carSelectedId).toBe(CARS[i].id);
    });
  });

  it('show/hide 控制顯示狀態', () => {
    screen.show();
    expect(document.getElementById('screen-car-select').style.display).toBe('flex');
    screen.hide();
    expect(document.getElementById('screen-car-select').style.display).toBe('none');
  });

  it('back 按鈕觸發 onBack 回呼', () => {
    const backBtn = document.querySelector('.back-btn');
    backBtn.click();
    expect(backCalled).toBe(true);
  });

  it('renderTrackList 顯示正確數量的賽道卡片', () => {
    document.body.innerHTML = '';
    let trackSelectedId = null;
    const trackScreen = new SelectionScreen(
      'screen-track-select',
      '選擇賽道',
      TRACKS,
      (id) => { trackSelectedId = id; },
      () => {}
    );
    const cards = document.querySelectorAll('.selection-card');
    expect(cards.length).toBe(TRACKS.length);
  });

  it('renderTrackList 顯示難度標示', () => {
    document.body.innerHTML = '';
    const trackScreen = new SelectionScreen(
      'screen-track-select',
      '選擇賽道',
      TRACKS,
      () => {},
      () => {}
    );
    const difficulties = document.querySelectorAll('.difficulty');
    expect(difficulties.length).toBeGreaterThan(0);
  });

  it('onTrackSelected 回呼帶入正確 trackId', () => {
    document.body.innerHTML = '';
    let trackSelectedId = null;
    const trackScreen = new SelectionScreen(
      'screen-track-select',
      '選擇賽道',
      TRACKS,
      (id) => { trackSelectedId = id; },
      () => {}
    );
    const firstCard = document.querySelector('.selection-card');
    firstCard.click();
    expect(trackSelectedId).toBe(TRACKS[0].id);
  });
});
