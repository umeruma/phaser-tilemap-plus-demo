import Phaser from 'phaser';

export default class MenuState extends Phaser.Scene {
  create() {
    this.input.keyboard.addCapture([
      Phaser.Input.Keyboard.KeyCodes.SPACE
    ]);

    this.cameras.main.setBackgroundColor("#00a9f0")

    const titleText = this.addText("Phaser Tilemap Plus Demo", 16 * 2, 20 * 2);
    const subtitleText = this.addText("Press Space to start", 12 * 2, 100 * 2);

    // const subtitleText2 = this.addText("Press Left Mouse button to toggle full screen mode", 12 * 2, 120 * 2);

    // fullscreen toggle
    // this.input.onDown.add(() => toggleFullScreen(this), this);

    // start game
    this.input.keyboard.on('keydown-SPACE', this.startGame, this);
  }

  startGame() {
    // if (this.input.keyboard.checkDown(Phaser.Input.Keyboard.KeyCodes.SPACE, 50))
    // {
      this.scene.start("Play")
    // }
  }

  addText(text, size, y) {
    const style = { font: "bold " + size + "px Arial", fill: "#fff"};
    const titleText = this.add.text(20, y, text, style);
    titleText.setShadow(1, 1, 'rgba(0,0,0,0.5)', 1);
  }
};

function toggleFullScreen(app) {
  // if (app.scale.isFullScreen)
  // {
  //     app.scale.stopFullScreen();
  // }
  // else
  // {
  //     app.scale.startFullScreen(false);
  // }
}
