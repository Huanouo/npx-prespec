export const TRACKS = [
  {
    id: 'track_01',
    name: '新手灣道',
    thumbnailUrl: '/assets/thumbnails/track_01.png',
    difficulty: 'easy',
    totalLaps: 3,
    startPosition: { x: 0, y: 0, z: -10 },
    startRotation: 0,
    checkpoints: [
      { id: 0, position: { x: 0, y: 0, z: -10 }, width: 10, isFinishLine: true },
      { id: 1, position: { x: 20, y: 0, z: 0 }, width: 10, isFinishLine: false },
      { id: 2, position: { x: 0, y: 0, z: 20 }, width: 10, isFinishLine: false },
      { id: 3, position: { x: -20, y: 0, z: 0 }, width: 10, isFinishLine: false }
    ],
    boundaryPolygon: [
      { x: -35, z: -25 },
      { x: 35, z: -25 },
      { x: 35, z: 35 },
      { x: -35, z: 35 }
    ],
    modelUrl: '/assets/models/track_01.glb'
  },
  {
    id: 'track_02',
    name: '急彎山路',
    thumbnailUrl: '/assets/thumbnails/track_02.png',
    difficulty: 'hard',
    totalLaps: 3,
    startPosition: { x: 0, y: 0, z: -10 },
    startRotation: 0,
    checkpoints: [
      { id: 0, position: { x: 0, y: 0, z: -10 }, width: 8, isFinishLine: true },
      { id: 1, position: { x: 15, y: 0, z: 5 }, width: 8, isFinishLine: false },
      { id: 2, position: { x: 0, y: 0, z: 25 }, width: 8, isFinishLine: false },
      { id: 3, position: { x: -15, y: 0, z: 10 }, width: 8, isFinishLine: false }
    ],
    boundaryPolygon: [
      { x: -28, z: -22 },
      { x: 28, z: -22 },
      { x: 28, z: 35 },
      { x: -28, z: 35 }
    ],
    modelUrl: '/assets/models/track_02.glb'
  }
];
