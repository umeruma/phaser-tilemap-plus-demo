import Phaser from "phaser"

import BootState from "./states/BootState";
import MenuState from "./states/MenuState";
import PlayState from "./states/PlayState";

const bootState = new BootState();
const menuState = new MenuState();
const playState = new PlayState();

const config = {
  type: Phaser.AUTO,
  parent: 'root',
  width: 320 * 2,
  height: 240 * 2,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 600 },
      // debug: true,
    }
  },
  scene: BootState
};
let game = new Phaser.Game(config);

game.scene.add("Menu", menuState);
game.scene.add("Play", playState);
