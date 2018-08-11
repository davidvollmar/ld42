import { Tile, TileType } from "./tile";


export class World {

    private tiles: Tile[][];

    private initX = 20
    private initY = 20

    private minX = 0;
    private maxX = 100;
    private minY = 0;
    private maxY = 100;

    constructor() {
        console.log("Init world")

        this.tiles = new Array<Array<Tile>>();

        for (let i = 0; i < this.initX; i++) {
            this.tiles[i] = new Array<Tile>()
            for (let j = 0; j < this.initY; j++) {
                if(i == 0 && j == 0) {
                    this.tiles[i][j] = new Tile(TileType.WATERCOR)
                } else if(i == 0 ) {
                    this.tiles[i][j] = new Tile(TileType.WATER1)
                } else if (j == 0) {
                    this.tiles[i][j] = new Tile(TileType.WATER1)
                } else {
                    this.tiles[i][j] = new Tile(this.getRandomTileType());
                }
            }
        }
    }

    getTile(c: Coordinate): Tile | null {
        if((this.tiles[c.x] || [])[0] === undefined) {
            return null;
        } else {
            if(this.tiles[c.x][c.y] === undefined) {
                return null;
            } else {
                return this.tiles[c.x][c.y];
            }
        }
    }

    getTiles(): Tile[][] {
        return this.tiles
    }

    addMissingTilesInRadius(coord: Coordinate, radius: integer): boolean {
        let toReturn: boolean = false;

        for (var x = coord.x - radius; x < coord.x + radius; x++) {
            for (var y = coord.y - radius; y < coord.y + radius; y++) {              
                if(!(x < this.minX || x > this.maxX || y < this.minY || y > this.maxY)) {
                    let tile = this.getTile({ x: x, y: y });
                    if(tile === null) {
                        if(this.tiles[x] === undefined) {                            
                            this.tiles[x] = new Array<Tile>();
                        }                        
                        this.tiles[x][y] = new Tile(this.getRandomTileType());
                        toReturn = true;
                    }
                }
            }
        }

        return toReturn;
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
