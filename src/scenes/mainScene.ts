import { World } from '../world'
import { Sheep } from '../sheep'
import { Tile, TileType } from '../tile'
import { Farmer } from '../farmer'
import { FarmerRender, FarmerRenderUpdater, WorldRenderer, SheepRenderer, SheepRenderUpdater } from '../renderers'
import { Keyboard } from '../keyboard'
import { Physics } from 'phaser';

export class MainScene extends Phaser.Scene {

  private world: World;
  private sheeps: Array<Sheep> = new Array();
  private cursors: CursorKeys | null = null;
  private player: Physics.Arcade.Sprite | null = null;

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
    new WorldRenderer().render(this, this.world)
    //new SheepRenderer().render(this, this.sheeps)
    //new FarmerRender().render(this, this.farmer)


    //this.farmer = new Farmer(this)    
    //this.events.addListener('moveEvent', this.farmer.handleEvent, this.farmer)
    this.player = this.physics.add.sprite(250, 256, 'farmer-left', 0);//TODO 256?

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
    
    this.cursors = this.input.keyboard.createCursorKeys();




    //physics

    let fences = this.physics.add.staticGroup();
    fences.create(0, 0, 'fence');
    fences.create(1000, 0, 'fence');

    /* this.sheeps.forEach(sheep => {
       this.physics.add.collider(sheep, fences);
     })*/

    //nieuwe manier van schapen maken    
    this.anims.create({
      key: 'sheep_animation',
      frames: this.anims.generateFrameNames('sheep', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: Phaser.FOREVER
    });

    var spriteBounds = Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.physics.world.bounds), -100, -100);

    for (var i = 0; i < 10; i++) {
      var pos = new Phaser.Geom.Point(i * 64, i * 64);
      var sheep = this.physics.add.sprite(pos.x, pos.y, 'sheep');
      let rotation = Math.random() * Math.PI * 2;
      sheep.setRotation(rotation);
      let velocity = this.physics.velocityFromRotation(rotation);
      sheep.setVelocity(velocity.x, velocity.y);
      sheep.play('sheep_animation');
    }
  }

  update(): void {
    const speed = 150;
    const prevVelocity = this.player!.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.player!.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors!.left!.isDown) {
      this.player!.body.setVelocityX(-speed);
    } else if (this.cursors!.right!.isDown) {
      this.player!.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors!.up!.isDown) {
      this.player!.body.setVelocityY(-speed);
    } else if (this.cursors!.down!.isDown) {
      this.player!.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player!.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors!.left!.isDown) {
      this.player!.anims.play("farmer_walk_left", true);
      console.log("left " + this.player!.body.position.x + " " + this.player!.body.position.y);
    } else if (this.cursors!.right!.isDown) {
      this.player!.anims.play("farmer_walk_right", true);
      console.log("right " + this.player!.body.position.x + " " + this.player!.body.position.y);
    } else if (this.cursors!.up!.isDown) {
      this.player!.anims.play("farmer_walk_up", true);
      console.log("up " + this.player!.body.position.x + " " + this.player!.body.position.y);
    } else if (this.cursors!.down!.isDown) {
      this.player!.anims.play("farmer_walk_down", true);
      console.log("down " + this.player!.body.position.x + " " + this.player!.body.position.y);
    } else {
      this.player!.anims.stop();

      // If we were moving, pick and idle frame to use
      if (prevVelocity.x < 0) this.player!.setTexture('farmer-left', 0);
      else if (prevVelocity.x > 0) this.player!.setTexture('farmer-right', 0);
      else if (prevVelocity.y < 0) this.player!.setTexture('farmer-up', 0);
      else if (prevVelocity.y > 0) this.player!.setTexture('farmer-down', 0);
    }
  }
}