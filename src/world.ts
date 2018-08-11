import { Tile, TileType } from "./tile";


export class World {

    private tiles: Tile[][];

    private initX = 20
    private initY = 20

    private minX = 0;
    private maxX = 100;
    private minY = 100;
    private maxY = 100;

    constructor() {
        console.log("Init world")

        this.tiles = new Array<Array<Tile>>();

        for (let i = 0; i < this.initX; i++) {
            this.tiles[i] = new Array<Tile>()
            for (let j = 0; j < this.initY; j++) {
                this.tiles[i][j] = new Tile(this.getRandomTileType());
            }
        }
    }

    getTile(c: Coordinate): Tile | null {
        return this.tiles[c.x][c.y];
    }

    getTiles(): Tile[][] {
        return this.tiles
    }

    addMissingTilesInRadius(coord: Coordinate, radius: integer) {

        for (var x = coord.x - radius; x < coord.x + radius; x++) {
            for (var y = coord.y - radius; y < coord.y + radius; y++) {
                //only continue within bounds
                if(!(x < this.minX || x > this.maxX || y < this.minY || y > this.maxY)) {
                    let checkCoord = { x: x, y: y };
                    //todo check arrays and add missing
                }
            }
        }
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
