import { describe, it, expect, beforeEach } from 'vitest';
import { Car } from '../../src/entities/Car.js';
import { CARS } from '../../src/data/cars.js';

describe('Car', () => {
  let car;
  const config = CARS[0];
  const startPosition = { x: 0, y: 0, z: -10 };
  const startRotation = 0;

  beforeEach(() => {
    car = new Car(config, startPosition, startRotation);
  });

  it('初始化後屬性正確', () => {
    expect(car.id).toBe('car_01');
    expect(car.velocity).toBe(0);
    expect(car.lapCount).toBe(0);
    expect(car.lapTimes).toEqual([]);
    expect(car.isReset).toBe(false);
    expect(car.config).toBe(config);
  });

  it('accelerate() 增加速度', () => {
    car.accelerate(0.016);
    expect(car.velocity).toBeGreaterThan(0);
  });

  it('accelerate() 速度不超過 maxSpeed', () => {
    for (let i = 0; i < 1000; i++) car.accelerate(0.016);
    expect(car.velocity).toBeLessThanOrEqual(car.config.maxSpeed);
  });

  it('brake() 減少速度，不低於 0', () => {
    car.velocity = 0.2;
    car.brake(0.016);
    expect(car.velocity).toBeGreaterThanOrEqual(0);
    expect(car.velocity).toBeLessThan(0.2);
  });

  it('brake() 速度已為 0 時不會變成負數', () => {
    car.velocity = 0;
    car.brake(0.016);
    expect(car.velocity).toBe(0);
  });

  it('steer() 在速度 > 0 時改變 rotation', () => {
    car.velocity = 0.2;
    const prevRotation = car.rotation;
    car.steer(1, 0.016);
    expect(car.rotation).not.toBe(prevRotation);
  });

  it('steer() 靜止時無效', () => {
    car.velocity = 0;
    const prevRotation = car.rotation;
    car.steer(1, 0.016);
    expect(car.rotation).toBe(prevRotation);
  });

  it('steer() direction=0 不改變 rotation', () => {
    car.velocity = 0.2;
    const prevRotation = car.rotation;
    car.steer(0, 0.016);
    expect(car.rotation).toBe(prevRotation);
  });

  it('applyFriction() 減少速度', () => {
    car.velocity = 0.3;
    car.applyFriction(0.016);
    expect(car.velocity).toBeLessThan(0.3);
    expect(car.velocity).toBeGreaterThanOrEqual(0);
  });

  it('updatePosition() 根據速度更新位置', () => {
    car.velocity = 0.5;
    car.rotation = 0;
    const prevZ = car.position.z;
    car.updatePosition(0.016);
    expect(car.position.z).not.toBe(prevZ);
  });

  it('completeLap() 記錄圈數與圈時', () => {
    car.completeLap(45000);
    expect(car.lapCount).toBe(1);
    expect(car.lapTimes).toEqual([45000]);

    car.completeLap(42000);
    expect(car.lapCount).toBe(2);
    expect(car.lapTimes).toEqual([45000, 42000]);
  });

  it('resetToPosition() 設定位置並清除速度和重置旗標', () => {
    car.velocity = 0.5;
    car.isReset = true;
    car.resetToPosition({ x: 5, y: 0, z: 5 }, 1.0);
    expect(car.velocity).toBe(0);
    expect(car.isReset).toBe(false);
    expect(car.position.x).toBe(5);
    expect(car.position.z).toBe(5);
    expect(car.rotation).toBe(1.0);
  });

  it('startReset() 觸發重置流程', () => {
    car.velocity = 0.5;
    car.startReset();
    expect(car.isReset).toBe(true);
    expect(car.velocity).toBe(0);
  });

  it('startReset() 在 isReset=true 時不再觸發', () => {
    car.startReset();
    car.velocity = 0.3;
    car.startReset();
    expect(car.velocity).toBe(0.3);
  });
});
