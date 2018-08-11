import { World, TileType } from '../world'
import { Sheep } from '../sheep'

export class MainScene extends Phaser.Scene {

  private world: World;
  private sheep: Array<Sheep> = new Array();

  constructor() {
    super({
      key: "MainScene"
    });
    this.world = new World();

    Array.from(Array(10).keys()).forEach(i => this.sheep[i] = new Sheep({ x: i * 64, y: i * 64 }, Math.random() * 360), null);

  }

  preload(): void {
    this.load.image(TileType.GRASS, "assets/Graphics/grass.png")
    this.loadSpriteSheep()
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
    new SheepRenderer().render(this, this.sheep)
  }

  update(): void {
    this.sheep.forEach(baah => baah.moveRandom())
    new SheepRenderUpdater().render(this, this.sheep)
  }
}

interface Renderer<T> {
  render(scene: Phaser.Scene, object: T): void;
}

class WorldRenderer implements Renderer<World> {
  private tileSize = 64

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
  render(scene: Phaser.Scene, sheep: Array<Sheep>) {
    sheep.forEach(beeh => {      
      let sprite = scene.add.sprite(beeh.getPosition().x, beeh.getPosition().y, 'sheep')
      sprite.setOrigin(0, 0)
      sprite.setAngle(beeh.getAngle() + Math.PI / 2.0 )

      let walk = scene.anims.create({
        key: 'beehmation',
        frames: scene.anims.generateFrameNames('sheep', { start: 0, end: 3 }),
        frameRate: 6,
        repeat: Phaser.FOREVER
      });

      sprite.anims.play('beehmation')

      beeh.setSprite(sprite)
    })
  }
}

class SheepRenderUpdater implements Renderer<Array<Sheep>> {
  render(scene: Phaser.Scene, sheep: Array<Sheep>) {
    sheep.forEach(baah => {
      let sprite = baah.getSprite()
      let position = baah.getPosition()
      sprite.setPosition(position.x, position.y)
      sprite.setAngle(baah.getAngle())
    })
  }
}
