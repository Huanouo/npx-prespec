import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { InputManager } from '../../src/input/InputManager.js';

describe('InputManager', () => {
  let manager;

  beforeEach(() => {
    manager = new InputManager();
  });

  afterEach(() => {
    manager.dispose();
  });

  it('初始狀態所有輸入為 false', () => {
    const input = manager.getInput();
    expect(input.accelerate).toBe(false);
    expect(input.brake).toBe(false);
    expect(input.steerLeft).toBe(false);
    expect(input.steerRight).toBe(false);
    expect(input.pause).toBe(false);
  });

  it('ArrowUp 鍵按下後 accelerate 為 true', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    expect(manager.getInput().accelerate).toBe(true);
  });

  it('ArrowUp 鍵放開後 accelerate 為 false', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowUp' }));
    expect(manager.getInput().accelerate).toBe(false);
  });

  it('KeyW 鍵對應 accelerate', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyW' }));
    expect(manager.getInput().accelerate).toBe(true);
  });

  it('ArrowDown / KeyS 鍵對應 brake', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowDown' }));
    expect(manager.getInput().brake).toBe(true);

    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowDown' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyS' }));
    expect(manager.getInput().brake).toBe(true);
  });

  it('ArrowLeft / KeyA 鍵對應 steerLeft', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowLeft' }));
    expect(manager.getInput().steerLeft).toBe(true);

    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowLeft' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyA' }));
    expect(manager.getInput().steerLeft).toBe(true);
  });

  it('ArrowRight / KeyD 鍵對應 steerRight', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowRight' }));
    expect(manager.getInput().steerRight).toBe(true);

    window.dispatchEvent(new KeyboardEvent('keyup', { code: 'ArrowRight' }));
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'KeyD' }));
    expect(manager.getInput().steerRight).toBe(true);
  });

  it('Escape 鍵觸發 pause（one-shot）', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'Escape' }));
    expect(manager.getInput().pause).toBe(true);
    expect(manager.getInput().pause).toBe(false);
  });

  it('dispose() 移除事件監聽器後按鍵無效', () => {
    manager.dispose();
    window.dispatchEvent(new KeyboardEvent('keydown', { code: 'ArrowUp' }));
    expect(manager.getInput().accelerate).toBe(false);
  });
});
