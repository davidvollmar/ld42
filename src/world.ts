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
                this.tiles[i][j] = {tileType: "grass"}
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

export type TileType = "grass" | "land" | "fence" 

