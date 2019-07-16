import Phaser from 'phaser';
import "phaser3-tilemap-plus";

export default class PlayState extends Phaser.Scene {
  constructor() {
    super();
    this.collisionLayer = null;
    this.groundLayer = null;
    this.player = null;
    this.cursors = null;
    this.tilemap = null;
    this.groundTileset = null;
    this.tilemapAnimations = null;
  }

  init(params) {
    //alert(params.foo);
  }

  preload() {
    this.plugins.installScenePlugin( 'TilemapPlusPlugin', Phaser.Plugins.TilemapPlus, 'tilemapplus', this);
    console.log(Phaser.Plugins.TilemapPlus);
    this.load.spritesheet('Player', 'assets/graphics/PlayerSpriteSheet.png', {frameWidth:39, frameHeight:40});
    this.load.tilemapTiledJSON('TileMap', 'assets/maps/world1/TileMap.json');
    this.load.image('Background', 'assets/graphics/world1/Background.png');
    this.load.image('Ground', 'assets/graphics/world1/Ground.png');
    this.load.audio('Thud', 'assets/audio/thud.wav');
    this.load.audio('Spring', 'assets/audio/spring.wav');
  }

  create() {
    // change the background colour
    this.cameras.main.setBackgroundColor("#a9f0ff");

    // add tilemap
    this.tilemap = this.make.tilemap({ key: 'TileMap' });

    // background layer
    const backgroundTileset = this.tilemap.addTilesetImage('Background', 'Background');
    const backgroundLayer = this.tilemap.createStaticLayer('Background', backgroundTileset, 0, 0);
    // backgroundLayer.scrollFactorX = backgroundLayer.scrollFactorY = 0.5;

    // ground layer
    this.groundTileset = this.tilemap.addTilesetImage('Ground', 'Ground');
    this.groundLayer = this.tilemap.createStaticLayer('Ground', this.groundTileset, 0, 0);
    this.groundLayer.setCollisionByExclusion(0);

    // set world bounds
    this.cameras.main.setBounds(0, 0, 16 * 128, 16 * 32);
    this.physics.world.setBounds(0, 0, 16 * 128, 16 * 32);

    // player stuff
    // add the sprite to the game and enable arcade physics on it
    this.player = this.physics.add.sprite(50, this.sys.canvas.height / 2, 'Player');
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.groundLayer)

    // set some physics on the sprite
    this.player.body.gravity.y = 2000;
    this.player.body.gravity.x = 0;
    this.player.body.velocity.x = 0;
    // this.player.anchor.setTo(0.5, 0.5);

    this.player.body.bounce.x = 0;
    this.player.body.bounce.y = 0;
    this.player.body.maxVelocity.x = 250;
    this.player.body.maxVelocity.y = 1000;
    this.player.body.collideWorldBounds = true;

    this.player.body.width = 16;
    this.player.body.setSize(10, 38, 15, 0);

    // Plus Feature: get start position from custom properties if set
    const tilemapProperties = this.tilemap.plus.properties;
    if (tilemapProperties.playerStartX) {
      this.player.x  = tilemapProperties.playerStartX * 16;
    }
    if (tilemapProperties.playerStartY) {
      this.player.y  = tilemapProperties.playerStartY * 16;
    }

    // Plus Feature: set capsule shape - overrides Arcade rectangle shape
    this.player.plus.setBodyCapsule(20, 40, 9);

    // create a running animation for the sprite and play it
    this.anims.create({
      key: 'still',
      frames: this.anims.generateFrameNumbers('Player', { start: 0, end: 0 }),
      frameRate: 24,
      repeat: -1
    });
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('Player', { start: 0, end: 20 }),
      frameRate: 24,
      repeat: -1
    });
    this.player.anims.play('still');

    // make the camera follow the sprite
    this.cameras.main.startFollow(this.player);
    // this.camera.lerp.setTo(0.1);

    // enable cursor keys so we can create some controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Plus Feature: tile animation
    // this.tilemap.plus.animation.enable();
    this.tilemap.plus.physics.enableObjectLayer("Collision");

    // add some audio
    // const thudAudio = this.add.audio("Thud");
    // const springAudio = this.add.audio("Spring");

    // Plus Feature: collision events
    // this.tilemap.plus.events.collisions.add(this.player, (shape, oldVelocity, newVelocity, contactNormal) => {
    //     if (shape.properties.bounce) {
    //         springAudio.play();
    //     }
    //     if (oldVelocity.y - newVelocity.y > 300) {
    //         thudAudio.play();
    //     }
    // });

    // set up light effect sprite for use with region events
    // create the light texture and sprite to use it
    // const gameWidth = this.game.width;
    // const gameHeight = this.game.height;
    // const lightTexture = this.add.bitmapData(gameWidth, gameHeight);
    // lightTexture.context.fillStyle = 'rgb(0, 0, 64)';
    // lightTexture.context.fillRect(0, 0, gameWidth, gameHeight);
    // const lightSprite = this.add.image(0, 0, lightTexture);
    // lightSprite.alpha = 0;
    // lightSprite.fixedToCamera = true;

    // Plus Feature: region events
    this.tilemap.plus.events.regions.enableObjectLayer("Events");
    this.tilemap.plus.events.regions.onEnterAdd(this.player, (region) => {
      // simulate entering a poorly lit area if region has custom property isDark = true
      if (region.properties.isDark) {
        this.add.tween(lightSprite).to( { alpha: 0.5 }, 250, "Linear", true);
      }
    });
    this.tilemap.plus.events.regions.onLeaveAdd(this.player, (region) => {
      // simulate leaving a poorly lit area
      if (region.properties.isDark) {
        this.add.tween(lightSprite).to( { alpha: 0.0 }, 250, "Linear", true);
      }
    });

    // fullscreen toggle
    // this.input.onDown.add(() => toggleFullScreen(this), this);
  }

  update() {
    const player = this.player;
    const collisionLayer = this.collisionLayer;
    const cursors = this.cursors;

    // const gravity = this.physics.gravity;
    const body = player.body;
    const blocked = body.blocked;
    const touching = body.touching;

    // Plus Feature: collision detectino and response
    this.tilemap.plus.physics.collideWith(player);

    // Plus Feature: region events
    this.tilemap.plus.events.regions.triggerWith(player);

    // apply drag only when touching
    const isTouching = body.plus.contactNormal.length() > 0;
    body.drag.x = isTouching ? 600 : 0;

    const wallNormal = body.plus.contactNormals.find(cn => cn.y == 0 && cn.x != 0);
    console.log(wallNormal);

    if (cursors.left.isDown) {
      player.setFlipX(true);
      player.anims.play('walk', true);
      body.acceleration.x = -3000;
    } else if (cursors.right.isDown) {
      player.setFlipX(false);
      player.anims.play('walk', true);
      body.acceleration.x = +3000;
    } else {
      player.anims.play('still', true);
      body.acceleration.x = 0;
    }

    // Make the sprite jump when the up key is pushed
    if (cursors.up.isDown) {
      // if (body.plus.contactNormal.y < 0) {
      body.velocity.y = -700;
      // }
    }
  }

  render() {
    //game.debug.body(sprite, 32, 32);
  }
}

function toggleFullScreen(app) {
  if (app.scale.isFullScreen)
  {
    app.scale.stopFullScreen();
  }
  else
  {
    app.scale.startFullScreen(false);
  }
}
