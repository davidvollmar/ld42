import { World, Coordinate } from '../world'
import { Sheep } from '../sheep'
import { WorldRenderer } from '../renderers'
import { Physics, Input } from 'phaser';
import { PathFinding, Path } from '../pathfinding';
import { Wolf } from '../wolf'
import { Loader } from '../loader'

export class MainScene extends Phaser.Scene {
  private debug = true

  private world: World;
  private sheeps: Array<Sheep> = new Array();
  private wolfs: Array<Wolf> = new Array();
  private cursors: CursorKeys | null = null;
  private key_w: Input.Keyboard.Key | null = null;
  private key_a: Input.Keyboard.Key | null = null;
  private key_s: Input.Keyboard.Key | null = null;
  private key_d: Input.Keyboard.Key | null = null;
  private player: Physics.Arcade.Sprite | null = null;

  private updateFenceTiles: Array<Coordinate> = new Array();
  private worldUpdateRequired = false
  private sheepCount = 100
  private wolfCount = 10
  private renderDistance = 6;
  private farmerSpeed = 250;
  private pathFinder: PathFinding | null = null

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
    new Loader(this)
  }

  create(): void {
    this.pathFinder = new PathFinding(this.world)
    this.pathFinder.findPath({ x: 2, y: 2 }, { x: 12, y: 12 }).then(this.renderDebugPath.bind(this))
    WorldRenderer.render(this, this.world)
    WorldRenderer.renderFenceFirstTime(this, this.world)
    this.createPlayer();
    this.createSheeps()
    this.createWolfs()
  }

  renderDebugPath(path: Path) {
    if (this.debug) {
      let graphics = this.add.graphics({ lineStyle: { color: 0xFF00FF, width: 5 } });
      let size = WorldRenderer.tileSize
      graphics.setDepth(100)
      for (let i = 0; i < path.length - 1; i++) {
        let p1 = path[i]
        let p2 = path[i + 1]
        let line = new Phaser.Geom.Line(
          size * p1.x + size / 2,
          size * p1.y + size / 2,
          size * p2.x + size / 2,
          size * p2.y + size / 2
        )
        graphics.strokeLineShape(line)
      }
    }
  }

  createPlayer() {
    this.player = this.physics.add.sprite(512, 512, 'farmer-left', 0);

    this.anims.create({
      key: 'farmer_walk_left',
      frames: this.anims.generateFrameNames('farmer-left', { start: 0, end: 7 }),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'farmer_walk_right',
      frames: this.anims.generateFrameNames('farmer-right', { start: 0, end: 7 }),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'farmer_walk_up',
      frames: this.anims.generateFrameNames('farmer-up', { start: 0, end: 7 }),
      frameRate: 12,
      repeat: -1
    });
    this.anims.create({
      key: 'farmer_walk_down',
      frames: this.anims.generateFrameNames('farmer-down', { start: 0, end: 7 }),
      frameRate: 12,
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

    for (let i = 0; i < this.sheepCount; i++) {
      let sheep = new Sheep(this, new Phaser.Geom.Point(i, i))
      this.sheeps.push(sheep)
    }
  }

  createWolfs() {
    this.anims.create({
      key: 'wolf_animation',
      frames: this.anims.generateFrameNames('wolf', { start: 0, end: 3 }),
      frameRate: 9,
      repeat: Phaser.FOREVER
    });

    for (let i = 0; i < this.wolfCount; i++) {
      let wolf = new Wolf(this, new Phaser.Geom.Point(i * 20, i * 20))
      this.wolfs.push(wolf)
    }
  }

  update(): void {
    if (this.worldUpdateRequired) {
      WorldRenderer.renderFence(this, this.updateFenceTiles, this.world)
      this.updateFenceTiles = Array<Coordinate>();

      this.worldUpdateRequired = false;
    }

    this.updateFarmer()

    //update world if needed
    let pos = { x: this.player!.x, y: this.player!.y }
    let tileCoordinates = WorldRenderer.worldToTileCoordinates(pos);
    let tilesToRender = this.world.addMissingTilesInRadius(tileCoordinates, this.renderDistance);
    if (tilesToRender !== undefined) { WorldRenderer.renderTiles(this, tilesToRender); }

    //update sheep
    this.sheeps.forEach(sheep => sheep.moveRandom())
    this.sheeps.forEach(sheep => {
      let sprite = sheep.getSprite();
      let sheepPos = { x: sprite.x, y: sprite.y };
      let tileCoord = WorldRenderer.worldToTileCoordinates(sheepPos);
      if(!sheep.hasTarget()) {
        let target = this.world.getClosestLotOfGrass(tileCoord)         
        console.log(target)
        sheep.moveTo(target);        
      }
      
      if (Math.random() < 0.001) {
        this.world.eatGrass(tileCoord);
      }
    });
  }

  updateFarmer() {
    const cursors = this.cursors!
    const player = this.player!
    const key_w = this.key_w!
    const key_a = this.key_a!
    const key_s = this.key_s!
    const key_d = this.key_d!
    const prevVelocity = player.body.velocity.clone();

    // Stop any previous movement from the last frame
    player.body.setVelocity(0);

    // Horizontal movement
    if (cursors.left.isDown || key_a.isDown) {
      player.body.setVelocityX(-this.farmerSpeed);
    } else if (cursors.right.isDown || key_d.isDown) {
      player.body.setVelocityX(this.farmerSpeed);
    }

    // Vertical movement
    if (cursors.up.isDown || key_w.isDown) {
      player.body.setVelocityY(-this.farmerSpeed);
    } else if (cursors.down.isDown || key_s.isDown) {
      player.body.setVelocityY(this.farmerSpeed);
    }

    // Fence placement
    if (cursors.space.isDown) {
      let pos = { x: player.x, y: player.y }
      let tileCoordinates = WorldRenderer.worldToTileCoordinates(pos);
      let tile = this.world.getTile(tileCoordinates)
      if (tile !== null && tile.canPlaceFence()) {
        tile.placeFence();

        this.updateFenceTiles.push({ x: tileCoordinates.x, y: tileCoordinates.y });
        this.worldUpdateRequired = true
      }
    }

    // Fence removing
    if (cursors.shift.isDown) {
      let pos = { x: player.x, y: player.y }
      let tileCoordinates = WorldRenderer.worldToTileCoordinates(pos);
      let tile = this.world.getTile(tileCoordinates)
      if (tile.hasFence) {
        tile.removeFence();

        this.updateFenceTiles.push({ x: tileCoordinates.x, y: tileCoordinates.y });
        this.worldUpdateRequired = true
      }
      this.pathFinder!.updateWorld(this.world)
      this.pathFinder!.findPath({ x: 2, y: 2 }, { x: 12, y: 12 }).then(this.renderDebugPath.bind(this))
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    player.body.velocity.normalize().scale(this.farmerSpeed);

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