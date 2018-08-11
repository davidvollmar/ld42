import { World, TileType } from '../world'

export class MainScene extends Phaser.Scene {
 
  private world: World;

  constructor() {
    super({
      key: "MainScene"
    });
    this.world = new World();
  }

  preload(): void {
    this.load.image(TileType.GRASS, "assets/fff.png")
  }

  create(): void {
    new WorldRenderer().render(this, this.world);
  }

  update(): void {
    
  }
}

class WorldRenderer implements Renderer<World> {
  private tileSize = 32

  render(scene: Phaser.Scene, world: World) {
    let arrays = world.getTiles()     
    for(var x = 0;  x < arrays.length; x++) {      
      let tiles = arrays[x]      
      for(var y = 0 ; y < tiles.length; y++) {
        let tile = tiles[y]        
        let sprite = scene.add.sprite(x * this.tileSize, y * this.tileSize, tile.tileType);
        sprite.setOrigin(0, 0);
      }
    }
  }
}

interface Renderer<T> {
  render(scene: Phaser.Scene, object: T): void;
}