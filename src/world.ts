export class World {
    
    private tiles: Tile[][]

    private maxX = 20
    private maxY = 20

    constructor() {
        console.log("Init world")

        this.tiles = new Array<Array<Tile>>()
        for(let i = 0; i < 20; i++) {
            this.tiles[i] = new Array<Tile>()
            for(let j = 0 ; j < 20; j++) {
                this.tiles[i][j] = {tileType: TileType.GRASS}
            }
        }        
    }

    public getTile(c: Coordinate): Tile {
        return this.tiles[c.x][c.y]
    }

    public getTiles(): Array<Array<Tile>> {
        return this.tiles
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

export enum TileType {
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
