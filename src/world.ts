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
                this.tiles[i][j] = { tileType: type }
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

export class Tile {
    public tileType: TileType

    constructor(tileType: TileType) {
        this.tileType = tileType
    }
}

export const enum TileType {
    GRASS = "grass",
    GRASSSHORT = "grass_short",
    GRASSGONE = "grass_gone",
    WATER0 = "water_0",
    WATER1 = "water_1",
    WATERPAR = "water_parallel",
    WATERCOR = "water_corner",
    WATER3 = "water_3",
    WATER4 = "water_4",
    FENCE = "fence"
}
