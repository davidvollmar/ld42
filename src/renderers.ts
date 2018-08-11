import { World, Coordinate } from './world'
import { TileType } from './tile';

export class WorldRenderer {
    private tileSize = 128

    render(scene: Phaser.Scene, world: World) {
        let arrays = world.getTiles()
        for (var x = 0; x < arrays.length; x++) {
            let tiles = arrays[x]
            for (var y = 0; y < tiles.length; y++) {
                let tile = tiles[y]
                let posX = x * this.tileSize
                let posY = y * this.tileSize
                let sprite = scene.add.sprite(posX, posY, tile.tileType);
                tile.tileSprite = sprite
                sprite.setOrigin(0, 0);
            }
        }
    }

    fence(scene: Phaser.Scene, world: World) {
        let arrays = world.getTiles()
        for (var x = 0; x < arrays.length; x++) {
            let tiles = arrays[x]
            for (var y = 0; y < tiles.length; y++) {
                let tile = tiles[y]
                let posX = x * this.tileSize
                let posY = y * this.tileSize
                if (tile.hasFence && tile.fenceSprite == null) {
                    let fence = scene.add.sprite(posX, posY, TileType.FENCE)
                    fence.setOrigin(0, 0);
                    fence.setSize(128, 128);
                    tile.fenceSprite = fence
                }
            }
        }
    }

    worldToTileCoordinates(c: Coordinate): Coordinate {
        let x = Math.floor(c.x / this.tileSize)
        let y = Math.floor(c.y / this.tileSize)
        return { x, y }
    }
}
