import { Tile, TileType } from "./tile";

export class World {

    private tiles: Tile[][]

    private maxX = 20
    private maxY = 20

    constructor() {
        console.log("Init world")

        this.tiles = new Array<Array<Tile>>()
        for (let i = 0; i < this.maxX; i++) {
            this.tiles[i] = new Array<Tile>()
            for (let j = 0; j < this.maxY; j++) {
                let type = this.getRandomTileType();
                this.tiles[i][j] = { tileType: type, hasFence: false }
            }
        }
    }

    getTile(c: Coordinate): Tile {
        return this.tiles[c.x][c.y]
    }

    getTiles(): Array<Array<Tile>> {
        return this.tiles
    }

    private getRandomTileType(): TileType {
        const types = [TileType.GRASS, TileType.GRASSSHORT, TileType.GRASSGONE]
        const options = types.length

        return types[Math.floor(options * Math.random())]
    }
}

export interface Coordinate {
    x: integer,
    y: integer
}
