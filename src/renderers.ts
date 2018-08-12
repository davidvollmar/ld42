import { World, Coordinate } from './world'
import { TileType, Tile } from './tile';

export class WorldRenderer {
    public static tileSize = 64

    static render(scene: Phaser.Scene, world: World) {
        this.renderTiles(scene, world.getTiles());
    }

    static forEachGridTile<T>(arr: T[][], func: (field: T, x: number, y: number) => void) {
        for (let x = 0; x < arr.length; x++) {
            let tiles = arr[x]
            if (tiles !== undefined) {
                for (let y = 0; y < tiles.length; y++) {
                    func(tiles[y], x, y)
                }
            }
        }
    }

    static renderTiles(scene: Phaser.Scene, arrays: Tile[][]) {
        this.forEachGridTile(arrays, (tile: Tile, x: number, y: number) => {
            let posX = x * this.tileSize
            let posY = y * this.tileSize
            let sprite = scene.add.sprite(posX, posY, tile.tileType);
            sprite.setSize(this.tileSize, this.tileSize);
            sprite.setDisplaySize(this.tileSize, this.tileSize);
            sprite.setOrigin(0, 0);
            sprite.setDepth(-100);
            tile.tileSprite = sprite
        })
    }

    /* Render everything when you run it for the first time */
    static renderFenceFirstTime(scene: Phaser.Scene, world: World) {
        let arrays = world.getTiles()
        this.forEachGridTile(arrays, (tile: Tile, x: number, y: number) => {
            if (tile !== undefined) {
                let posX = x * this.tileSize
                let posY = y * this.tileSize
                if (tile.hasFence && tile.fenceSprite == null) {
                    let fence = scene.add.sprite(posX, posY, TileType.FENCEWE)
                    fence.setOrigin(0, 0);
                    fence.setSize(this.tileSize, this.tileSize);
                    fence.setDisplaySize(this.tileSize, this.tileSize);
                    tile.fenceSprite = fence

                    this.updateFenceSprite({ x, y }, scene, world, false);
                }
            }
        })
    }

    /* render only incrementally */
    static renderFence(scene: Phaser.Scene, updateFences: Coordinate[], world: World) {
        for (var i = 0; i < updateFences.length; i++) {
            let x = updateFences[i].x;
            let y = updateFences[i].y;
            let tile = world.getTiles()[x][y];

            if (tile !== undefined) {
                let posX = x * this.tileSize
                let posY = y * this.tileSize
                if (tile.hasFence) {
                    let fence = scene.add.sprite(posX, posY, TileType.FENCEWE)
                    fence.setOrigin(0, 0);
                    fence.setSize(this.tileSize, this.tileSize);
                    fence.setDisplaySize(this.tileSize, this.tileSize);
                    fence.setVisible(true);
                    tile.fenceSprite = fence

                    //recursively check neighbor situation and decide how to update fences
                    this.updateFenceSprite({ x, y }, scene, world, true);

                } else if (!tile.hasFence && tile.fenceSprite !== null) {
                    tile.fenceSprite.setVisible(false);

                    //recursively check neighbor situation and decide how to update fences
                    this.updateFenceSprite({ x, y }, scene, world, false);
                }

            }
        }
    }

    static updateFenceSprite(c: Coordinate, scene: Phaser.Scene, world: World, recCall: boolean) {
        let neighbours = this.getNeighbouringFences(c, world);
        let s = "";
        for (let i = 0; i < neighbours.length; i++) {
            if (neighbours[i]) {
                s += "1";
            } else {
                s += "0";
            }
        }

        switch (s) {
            case "0000":
                break;
            case "0001":
                if (recCall) { this.updateFenceSprite({ x: c.x - 1, y: c.y }, scene, world, false) };
                break;
            case "0010":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCENS);
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y + 1 }, scene, world, false) };
                break;
            case "0011":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCECOR);
                if (recCall) { this.updateFenceSprite({ x: c.x - 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y + 1 }, scene, world, false) };
                break;
            case "0100":
                if (recCall) { this.updateFenceSprite({ x: c.x + 1, y: c.y }, scene, world, false) };
                break;
            case "0101":
                if (recCall) { this.updateFenceSprite({ x: c.x + 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x - 1, y: c.y }, scene, world, false) };
                break;
            case "0110":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCECOR).setOrigin(1, 0).setAngle(270);
                if (recCall) { this.updateFenceSprite({ x: c.x + 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y + 1 }, scene, world, false) };
                break;
            case "0111":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCET).setOrigin(0, 0).setAngle(0);
                if (recCall) { this.updateFenceSprite({ x: c.x + 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y + 1 }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x - 1, y: c.y }, scene, world, false) };
                break;

            case "1000":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCENS);
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y - 1 }, scene, world, false) };
                break;
            case "1001":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCECOR).setOrigin(0, 1).setAngle(90);
                if (recCall) { this.updateFenceSprite({ x: c.x - 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y - 1 }, scene, world, false) };
                break;
            case "1010":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCENS);
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y - 1 }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y + 1 }, scene, world, false) };
                break;
            case "1011":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCET).setOrigin(0, 1).setAngle(90);
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y - 1 }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y + 1 }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x - 1, y: c.y }, scene, world, false) };
                break;
            case "1100":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCECOR).setOrigin(1, 1).setAngle(180);
                if (recCall) { this.updateFenceSprite({ x: c.x + 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y - 1 }, scene, world, false) };
                break;
            case "1101":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCET).setOrigin(1, 1).setAngle(180);
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y - 1 }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x + 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x - 1, y: c.y }, scene, world, false) };
                break;
            case "1110":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCET).setOrigin(1, 0).setAngle(270);
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y - 1 }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x + 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y + 1 }, scene, world, false) };
                break;
            case "1111":
                world.getTile(c)!.fenceSprite!.setTexture(TileType.FENCECROSS);
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y - 1 }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x + 1, y: c.y }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x, y: c.y + 1 }, scene, world, false) };
                if (recCall) { this.updateFenceSprite({ x: c.x - 1, y: c.y }, scene, world, false) };
                break;
        }
    }

    static getNeighbouringFences(c: Coordinate, world: World) {
        //north-east-south-west
        let neighbouringFences = new Array<Boolean>();
        for (var i = 0; i < 4; i++) {
            neighbouringFences[i] = false;
        }
        let x = c.x;
        let y = c.y;
        let tile;

        if ((tile = world.getTile({ x, y: y - 1 })) !== null) {
            if (tile.hasFence) {
                neighbouringFences[0] = true;
            }
        }
        if ((tile = world.getTile({ x: x + 1, y })) !== null) {
            if (tile.hasFence) {
                neighbouringFences[1] = true;
            }
        }
        if ((tile = world.getTile({ x, y: y + 1 })) !== null) {
            if (tile.hasFence) {
                neighbouringFences[2] = true;
            }
        }
        if ((tile = world.getTile({ x: x - 1, y })) !== null) {
            if (tile.hasFence) {
                neighbouringFences[3] = true;
            }
        }

        return neighbouringFences;
    }

    static worldToTileCoordinates(c: Coordinate): Coordinate {
        let x = Math.floor(c.x / this.tileSize)
        let y = Math.floor(c.y / this.tileSize)
        return { x, y }
    }
}
