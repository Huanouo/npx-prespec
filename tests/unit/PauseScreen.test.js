import { describe, it, expect, beforeEach } from 'vitest';
import { PauseScreen } from '../../src/ui/PauseScreen.js';

describe('PauseScreen', () => {
  let resumeCalled = false;
  let retryCalled = false;
  let menuCalled = false;
  let screen;

  beforeEach(() => {
    document.body.innerHTML = '';
    resumeCalled = false;
    retryCalled = false;
    menuCalled = false;
    screen = new PauseScreen(
      () => { resumeCalled = true; },
      () => { retryCalled = true; },
      () => { menuCalled = true; }
    );
  });

  it('顯示「繼續」按鈕', () => {
    const btn = document.getElementById('btn-resume');
    expect(btn).not.toBeNull();
  });

  it('顯示「重試」按鈕', () => {
    const btn = document.getElementById('btn-retry-pause');
    expect(btn).not.toBeNull();
  });

  it('顯示「返回主選單」按鈕', () => {
    const btn = document.getElementById('btn-menu-pause');
    expect(btn).not.toBeNull();
  });

  it('點擊「繼續」觸發 onResume 回呼', () => {
    document.getElementById('btn-resume').click();
    expect(resumeCalled).toBe(true);
  });

  it('點擊「重試」觸發 onRetry 回呼', () => {
    document.getElementById('btn-retry-pause').click();
    expect(retryCalled).toBe(true);
  });

  it('點擊「返回主選單」觸發 onMenu 回呼', () => {
    document.getElementById('btn-menu-pause').click();
    expect(menuCalled).toBe(true);
  });

  it('show/hide 控制顯示狀態', () => {
    screen.show();
    expect(document.getElementById('screen-pause').style.display).toBe('flex');
    screen.hide();
    expect(document.getElementById('screen-pause').style.display).toBe('none');
  });
});
