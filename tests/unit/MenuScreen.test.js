import { describe, it, expect, beforeEach } from 'vitest';
import { MenuScreen } from '../../src/ui/MenuScreen.js';

describe('MenuScreen', () => {
  let startCalled = false;
  let recordsCalled = false;
  let screen;

  beforeEach(() => {
    document.body.innerHTML = '';
    startCalled = false;
    recordsCalled = false;
    screen = new MenuScreen(
      () => { startCalled = true; },
      () => { recordsCalled = true; }
    );
  });

  it('顯示「開始遊戲」按鈕', () => {
    const btn = document.getElementById('btn-start');
    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe('開始遊戲');
  });

  it('顯示「查看記錄」按鈕', () => {
    const btn = document.getElementById('btn-records');
    expect(btn).not.toBeNull();
    expect(btn.textContent).toBe('查看記錄');
  });

  it('點擊「開始遊戲」觸發 onStart 回呼', () => {
    document.getElementById('btn-start').click();
    expect(startCalled).toBe(true);
  });

  it('點擊「查看記錄」觸發 onRecords 回呼', () => {
    document.getElementById('btn-records').click();
    expect(recordsCalled).toBe(true);
  });

  it('show/hide 控制顯示狀態', () => {
    screen.show();
    expect(document.getElementById('screen-menu').style.display).toBe('flex');
    screen.hide();
    expect(document.getElementById('screen-menu').style.display).toBe('none');
  });
});
