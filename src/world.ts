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
                if (i == 0 && j == 0) {
                    this.tiles[i][j] = new Tile(TileType.WATER0)
                } else if (i == 0) {
                    this.tiles[i][j] = new Tile(TileType.WATER1E)
                } else if (j == 0) {
                    this.tiles[i][j] = new Tile(TileType.WATER1S)
                } else {
                    this.tiles[i][j] = new Tile(this.getRandomTileType());
                }
            }
        }

        const boxSize = 10
        const boxOrigin = { x: 1, y: 1 }
        for (let i = boxOrigin.x; i < boxOrigin.x + boxSize; i++) {
            for (let j = boxOrigin.y; j < boxOrigin.y + boxSize; j++) {
                if (i == boxOrigin.x ||
                    i == boxOrigin.x + boxSize -1 ||
                    j == boxOrigin.y || 
                    j == boxOrigin.y + boxSize - 1                     
                ) {
                    this.tiles[i][j].hasFence = true
                }
            }
        }
    }

    addTile(c: Coordinate, t: TileType) {
        if (this.tiles[c.x] === undefined) {
            this.tiles[c.x] = new Array<Tile>();
        }
        this.tiles[c.x][c.y] = new Tile(t);
    }

    getTile(c: Coordinate): Tile | null {
        if (this.tiles[c.x] === undefined) {
            return null;
        } else {
            if (this.tiles[c.x][c.y] === undefined) {
                return null;
            } else {
                return this.tiles[c.x][c.y];
            }
        }
    }

    getTiles(): Tile[][] {
        return this.tiles
    }

    addMissingTilesInRadius(coord: Coordinate, radius: integer): Tile[][] {
        let toReturn: Tile[][] = new Array<Array<Tile>>();

        for (var x = coord.x - radius; x < coord.x + radius; x++) {
            for (var y = coord.y - radius; y < coord.y + radius; y++) {
                if (!(x < this.minX || x > this.maxX || y < this.minY || y > this.maxY)) {
                    let tile = this.getTile({ x: x, y: y });
                    if (tile === null) {
                        if (this.tiles[x] === undefined) {
                            this.tiles[x] = new Array<Tile>();
                        }
                        let tileType = this.getRandomTileType();
                        if (x == this.minX) {
                            if (y == this.maxY || y == this.minY) {
                                tileType = TileType.WATER0;
                            } else {
                                tileType = TileType.WATER1E;
                            }
                        } else if (x == this.maxX) {
                            if (y == this.maxY || y == this.minY) {
                                tileType = TileType.WATER0;
                            } else {
                                tileType = TileType.WATER1W;
                            }
                        } else {
                            if (y == this.minY) {
                                if (x == this.minX || x == this.maxX) {
                                    tileType = TileType.WATER0;
                                } else {
                                    tileType = TileType.WATER1S;
                                }
                            } else if (y == this.maxY) {
                                if (x == this.minX || x == this.maxX) {
                                    tileType = TileType.WATER0;
                                } else {
                                    tileType = TileType.WATER1N;
                                }
                            } else {
                                ///this is the default case, the tiletype is then ok at random
                            }
                        }

                        this.addTile({ x, y }, tileType);

                        if (toReturn[x] === undefined) {
                            toReturn[x] = new Array<Tile>();
                        }
                        toReturn[x][y] = new Tile(tileType);
                    }
                }
            }
        }

        return toReturn;
    }

    private getRandomTileType(): TileType {
        const types = [TileType.GRASS, TileType.GRASSSHORT, TileType.GRASSGONE]
        return Phaser.Math.RND.pick(types);
    }
}

export interface Coordinate {
    x: integer,
    y: integer
}
