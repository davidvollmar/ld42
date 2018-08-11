import { World } from '../world'
import { Sheep } from '../sheep'
import { Tile, TileType } from '../tile'
import { Farmer } from '../farmer'
import { FarmerRender, FarmerRenderUpdater, WorldRenderer, SheepRenderer, SheepRenderUpdater } from '../renderers'
import { Keyboard } from '../keyboard'

export class MainScene extends Phaser.Scene {

  private world: World;
  private sheeps: Array<Sheep> = new Array();
  private farmer: Farmer | null = null;
  private keyboard: Keyboard | null = null;

  constructor() {
    super({
      key: "MainScene",
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 300 },
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
    this.keyboard = new Keyboard(this)
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
    this.load.spritesheet('farmer', 'assets/Graphics/farmer.png', spritesheetconfig);
  }

  create(): void {
    this.farmer = new Farmer(this)    
    this.events.addListener('moveEvent', this.farmer.handleEvent, this.farmer)
    
    Array.from(Array(10).keys()).forEach(i =>
      this.sheeps[i] = new Sheep(
        this,
        { x: i * 64, y: i * 64 },
        Math.random() * Math.PI * 2
      ));


    new WorldRenderer().render(this, this.world)
    new SheepRenderer().render(this, this.sheeps)
    new FarmerRender().render(this, this.farmer)

    //physics

    let fences = this.physics.add.staticGroup();
    fences.create(0, 0, 'fence');
    fences.create(1000, 0, 'fence');

    this.sheeps.forEach(sheep => {
      this.physics.add.collider(sheep, fences);
    })

  }

  update(): void {
    this.keyboard!.update()
    this.sheeps.forEach(sheep => sheep.moveRandom())
    new SheepRenderUpdater().render(this.sheeps)
    new FarmerRenderUpdater().render(this.farmer!)
  }
}