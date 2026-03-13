import './styles/main.css';
import { Game } from './game/Game.js';

const container = document.getElementById('game-container') || document.body;
const game = new Game(container);

if (import.meta.env.DEV) {
  window._game = game;
}
