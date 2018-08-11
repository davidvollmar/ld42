import { World, Coordinate } from './world'
import { TileType, Tile } from './tile';

export class WorldRenderer {
    public static tileSize = 128

    static render(scene: Phaser.Scene, world: World) {
        this.renderTiles(scene, world.getTiles());
    }

    static renderTiles(scene: Phaser.Scene, arrays: Tile[][]) {
        for (var x = 0; x < arrays.length; x++) {
            let tiles = arrays[x]
            for (var y = 0; y < tiles.length; y++) {
                let tile = tiles[y]
                let posX = x * this.tileSize
                let posY = y * this.tileSize
                let sprite = scene.add.sprite(posX, posY, tile.tileType);
                sprite.setOrigin(0, 0);
                sprite.setDepth(-100);
                tile.tileSprite = sprite
                if (tile.hasFence && tile.fenceSprite == null) {
                    tile.fenceSprite = scene.add.sprite(posX, posY, TileType.FENCE)
                }
            }
        }
    }

    static placeFence(scene: Phaser.Scene, world: World) {
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

    static worldToTileCoordinates(c: Coordinate): Coordinate {
        let x = Math.floor(c.x / this.tileSize)
        let y = Math.floor(c.y / this.tileSize)
        return { x, y }
    }
}
