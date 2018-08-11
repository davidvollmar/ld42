import { World, TileType } from '../world'
import { Sheep } from '../sheep'

export class MainScene extends Phaser.Scene {

  private world: World;
  private sheeps: Array<Sheep> = new Array();

  constructor() {
    super({
      key: "MainScene"
    });
    this.world = new World();

    Array.from(Array(10).keys()).forEach(i => this.sheeps[i] = new Sheep({ x: i * 64, y: i * 64 }, Math.random() * Math.PI * 2), null);

  }

  preload(): void {
    this.loadSpriteTiles()
    this.loadSpriteSheep()
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

  create(): void {
    new WorldRenderer().render(this, this.world)
    new SheepRenderer().render(this, this.sheeps)
  }

  update(): void {
    this.sheeps.forEach(sheep => sheep.moveRandom())
    new SheepRenderUpdater().render(this, this.sheeps)
  }
}

interface Renderer<T> {
  render(scene: Phaser.Scene, object: T): void;
}

class WorldRenderer implements Renderer<World> {
  private tileSize = 128

  render(scene: Phaser.Scene, world: World) {
    let arrays = world.getTiles()
    for (var x = 0; x < arrays.length; x++) {
      let tiles = arrays[x]
      for (var y = 0; y < tiles.length; y++) {
        let tile = tiles[y]
        let sprite = scene.add.sprite(x * this.tileSize, y * this.tileSize, tile.tileType);
        sprite.setOrigin(0, 0);
      }
    }
  }
}

class SheepRenderer implements Renderer<Array<Sheep>> {
  render(scene: Phaser.Scene, sheeps: Array<Sheep>) {
    scene.anims.create({
      key: 'beehmation',
      frames: scene.anims.generateFrameNames('sheep', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: Phaser.FOREVER
    });

    sheeps.forEach(sheep => {      
      let sprite = scene.add.sprite(sheep.getPosition().x, sheep.getPosition().y, 'sheep')
      sprite.setOrigin(0, 0)
      sprite.setRotation(sheep.getRotation() + Math.PI / 2.0)

      sprite.anims.play('beehmation')

      sheep.setSprite(sprite)
    })
  }
}

class SheepRenderUpdater implements Renderer<Array<Sheep>> {
  render(scene: Phaser.Scene, sheeps: Array<Sheep>) {
    sheeps.forEach(sheep => {
      let sprite = sheep.getSprite()
      let position = sheep.getPosition()
      sprite.setPosition(position.x, position.y)
      sprite.setRotation(sheep.getRotation() + Math.PI / 2.0)
    })
  }
}
