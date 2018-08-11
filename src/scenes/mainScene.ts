import { World } from '../world'
import { Sheep } from '../sheep'
import { TileType } from '../tile'
import { WorldRenderer } from '../renderers'
import { Physics, Input } from 'phaser';

export class MainScene extends Phaser.Scene {

  private world: World;
  private sheeps: Array<Sheep> = new Array();
  private cursors: CursorKeys | null = null;
  private key_w: Input.Keyboard.Key | null = null;
  private key_a: Input.Keyboard.Key | null = null;
  private key_s: Input.Keyboard.Key | null = null;
  private key_d: Input.Keyboard.Key | null = null;
  private player: Physics.Arcade.Sprite | null = null;

  private worldUpdateRequired = false
  private sheepCount = 100

  constructor() {
    super({
      key: "MainScene",
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      }
    });
    this.world = new World();
  }

  preload(): void {
    this.loadSpriteTiles()
    this.loadSpriteSheep()
    this.loadFarmer()
  }

  loadSpriteTiles() {
    this.load.image(TileType.GRASS, 'assets/Graphics/LandTiles/Grass.png')
    this.load.image(TileType.GRASSSHORT, 'assets/Graphics/LandTiles/GrassShort.png')
    this.load.image(TileType.GRASSGONE, 'assets/Graphics/LandTiles/GrassGone.png')
    this.load.image(TileType.WATER0, 'assets/Graphics/LandTiles/Water0.png')
    this.load.image(TileType.WATER1, 'assets/Graphics/LandTiles/Water1.png')
    this.load.image(TileType.WATERPAR, 'assets/Graphics/LandTiles/WaterPar.png')
    this.load.image(TileType.WATERCOR, 'assets/Graphics/LandTiles/WaterCor.png')
    this.load.image(TileType.WATER3, 'assets/Graphics/LandTiles/Water3.png')
    this.load.image(TileType.WATER4, 'assets/Graphics/LandTiles/Water4.png')
    this.load.image(TileType.FENCE, 'assets/Graphics/LandTiles/Fence.png')
  }

  loadSpriteSheep() {
    let spritesheetconfig = {
      frameWidth: 64,
      frameHeight: 64,
      startFrame: 0,
      endFrame: 4,
      margin: 0,
      spacing: 0
    };
    this.load.spritesheet('sheep', 'assets/Graphics/Sheep.png', spritesheetconfig);
  }

  loadFarmer() {
    let spritesheetconfig = {
      frameWidth: 64,
      frameHeight: 64,
      startFrame: 0,
      endFrame: 8,
      margin: 0,
      spacing: 0
    };
    this.load.spritesheet('farmer-left', 'assets/Graphics/farmer-left.png', spritesheetconfig);
    this.load.spritesheet('farmer-right', 'assets/Graphics/farmer-right.png', spritesheetconfig);
    this.load.spritesheet('farmer-up', 'assets/Graphics/farmer-up.png', spritesheetconfig);
    this.load.spritesheet('farmer-down', 'assets/Graphics/farmer-down.png', spritesheetconfig);
  }

  create(): void {
    WorldRenderer.render(this, this.world)
    this.createPlayer();    
    this.createSheeps()
  }

  createPlayer() {
    this.player = this.physics.add.sprite(512, 512, 'farmer-left', 0);

    this.anims.create({
      key: 'farmer_walk_left',
      frames: this.anims.generateFrameNames('farmer-left', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'farmer_walk_right',
      frames: this.anims.generateFrameNames('farmer-right', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'farmer_walk_up',
      frames: this.anims.generateFrameNames('farmer-up', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1
    });
    this.anims.create({
      key: 'farmer_walk_down',
      frames: this.anims.generateFrameNames('farmer-down', { start: 0, end: 7 }),
      frameRate: 6,
      repeat: -1
    });
    
    const camera = this.cameras.main;
    camera.startFollow(this.player);
    

    this.cursors = this.input.keyboard.createCursorKeys();
    this.key_w = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.key_a = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.key_s = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.key_d = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
  }

  createSheeps() {    
    this.anims.create({
      key: 'sheep_animation',
      frames: this.anims.generateFrameNames('sheep', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: Phaser.FOREVER
    });

    // ??
    Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -100, -100);

    for (let i = 0; i < this.sheepCount; i++) {
      let pos = new Phaser.Geom.Point(i * 64, i * 64);
      let sprite = this.physics.add.sprite(pos.x, pos.y, 'sheep');
      let rotation = Math.random() * Math.PI * 2;
      sprite.setRotation(rotation);
      let velocity = this.physics.velocityFromRotation(rotation);
      sprite.setVelocity(velocity.x, velocity.y);
      sprite.play('sheep_animation');
      let sheep = new Sheep(this, rotation, sprite)
      this.sheeps.push(sheep)
    }
  }

  update(): void {    
    if(this.worldUpdateRequired) {
      WorldRenderer.placeFence(this, this.world)
    }

    this.updateFarmer()

    //update world if needed
    let pos = { x: this.player!.x, y: this.player!.y }    
    let tileCoordinates = WorldRenderer.worldToTileCoordinates(pos);
    let addedTiles = this.world.addMissingTilesInRadius(tileCoordinates, 3);
    WorldRenderer.renderTiles(this, addedTiles);

    //update sheep
    this.sheeps.forEach(sheep => sheep.moveRandom())
  }

  updateFarmer() {    
    const cursors = this.cursors!
    const player = this.player!
    const key_w = this.key_w!
    const key_a = this.key_a!
    const key_s = this.key_s!
    const key_d = this.key_d!

    const speed = 150;
    const prevVelocity = player.body.velocity.clone();

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown || key_a.isDown) {
      player.body.setVelocityX(-speed);
    } else if (cursors.right.isDown || key_d.isDown) {
      player.body.setVelocityX(speed);
    }

    // Vertical movement
    if (cursors.up.isDown || key_w.isDown) {
      player.body.setVelocityY(-speed);
    } else if (cursors.down.isDown || key_s.isDown) {
      player.body.setVelocityY(speed);
    }

    // Fence placement
    if(cursors.space.isDown) {
      let pos = { x: player.x, y: player.y }
      let tileCoordinates = WorldRenderer.worldToTileCoordinates(pos);
      let tile = this.world.getTile(tileCoordinates)
      tile!.hasFence = true
      this.worldUpdateRequired = true
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (cursors.left.isDown || key_a.isDown) {
      player.anims.play("farmer_walk_left", true);      
    } else if (cursors.right.isDown || key_d.isDown) {
      player.anims.play("farmer_walk_right", true);      
    } else if (cursors.up.isDown || key_w.isDown) {
      player.anims.play("farmer_walk_up", true);      
    } else if (cursors.down.isDown || key_s.isDown) {
      player.anims.play("farmer_walk_down", true);      
    } else {
      player.anims.stop();

      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) player.setTexture('farmer-left', 0);
      else if (prevVelocity.x > 0) player.setTexture('farmer-right', 0);
      else if (prevVelocity.y < 0) player.setTexture('farmer-up', 0);
      else if (prevVelocity.y > 0) player.setTexture('farmer-down', 0);
    }
  }
}