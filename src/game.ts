/// <reference path="phaser.d.ts"/>

import "phaser";
import { MainScene } from "./scenes/mainScene";

// main game configuration
const config: GameConfig = {
  width: 1024,
  height: 1024,
  type: Phaser.AUTO,
  parent: "game",
  scene: [MainScene],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  }
};

// game class
export class Game extends Phaser.Game {
  constructor(GameConfig: GameConfig) {
    super(config);
  }
}

// when the page is loaded, create our game instance
window.onload = () => {
  new Game(config);
};
