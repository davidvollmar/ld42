import { World } from './world'

export class WorldRenderer {
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
