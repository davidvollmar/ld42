import { Tile, TileType } from "./tile";


export class World {
    
    private tiles = new Map<Coordinate, Tile>();

    private initX = 20
    private initY = 20

    constructor() {
        console.log("Init world")        

        for (let i = 0; i < this.initX; i++) {            
            for (let j = 0; j < this.initY; j++) {
                let type = this.getRandomTileType();
                this.tiles.set({x: i, y: j}, new Tile(type));
            }
        }
    }

    //sorry
    getTile(c: Coordinate): Tile | null { 
        let toReturn = null;
        this.tiles.forEach((tile: Tile, coord: Coordinate) => {                        
            if(coord.x == c.x && coord.y == c.y) {
                toReturn = tile;
            }
        });
        return toReturn;
    }

    getTiles(): Map<Coordinate, Tile> {
        return this.tiles
    }

    addMissingTilesInRadius(coord: Coordinate, radius: integer): Map<Coordinate, Tile> {        
        let toReturn = new Map<Coordinate, Tile>();

        for(var x = coord.x - radius; x < coord.x + radius; x++) {
            for(var y = coord.y - radius; y < coord.y + radius; y++) {                
                let checkCoord = {x: x, y: y};
                if (this.getTile(checkCoord) == null) {
                    console.log("need to add tile at x: " + x + ", y: " + y);
                    let type = this.getRandomTileType();
                    this.tiles.set(checkCoord, new Tile(type));                    
                    toReturn.set(checkCoord, new Tile(type));
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
