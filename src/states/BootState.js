import Phaser from "phaser"

export default class BootState extends Phaser.Scene {
  create() {
    this.initGraphics();
    this.initPhysics();
    this.game.scene.start("Menu")
  }

  initGraphics() {
    // TODO: 📌 Convert scripts for Phaser3
    // this.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

    // scale the game 2x
    // this.scale.scaleMode = Phaser.ScaleManager.USER_SCALE;
    // this.scale.setUserScale(2, 2);

    // enable crisp rendering
    // this.game.renderer.renderSession.roundPixels = true;
    // Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
  }

  initPhysics() {
    // TODO: 📌 Convert scripts for Phaser3
    // physics
    // this.time.advancedTiming = true;

    // // enable arcade slopes plugin
    // this.physics.startSystem(Phaser.Physics.ARCADE);
    // this.physics.arcade.gravity.y = 1000;
  }
};
