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
                    i == boxOrigin.x + boxSize - 1 ||
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

    getTile(c: Coordinate): Tile {
        if (c.x < 0 || c.y < 0) {
            throw new RangeError("coordinate out of world bounds: " + c)
        }

        if (this.tiles[c.x] === undefined) {
            throw new RangeError("coordinate out of world bounds: " + c)
        } else {
            if (this.tiles[c.x][c.y] === undefined) {
                throw new RangeError("coordinate out of world bounds: " + c)
            } else {
                return this.tiles[c.x][c.y];
            }
        }
    }

    getTiles(): Tile[][] {
        return this.tiles
    }

    eatGrass(c: Coordinate) {
        if (this.tiles[c.x] !== undefined) {
            let tile = this.tiles[c.x][c.y];
            if (tile !== undefined && tile.canEat()) {
                tile.eat();
            }
        }
    }

    addMissingTilesInRadius(coord: Coordinate, radius: integer): Tile[][] {
        let toReturn: Tile[][] = new Array<Array<Tile>>();

        for (var x = coord.x - radius; x < coord.x + radius; x++) {
            for (var y = coord.y - radius; y < coord.y + radius; y++) {
                if (!(x < this.minX || x > this.maxX || y < this.minY || y > this.maxY)) {
                    try {
                        this.getTile({ x: x, y: y });
                    } catch (e) {
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
                        toReturn[x][y] = new Tile(tileType)
                    }
                }
            }
        }

        return toReturn;
    }

    getClosestLotOfGrass(from: Coordinate): Coordinate {
        if (this.getTile(from).tileType == TileType.GRASS) {
            return from
        }

        let neighbours = this.getNeighbours(from)
        let tiles = this.getTilesFiltererd(neighbours, (tile: Tile ) => {
            return tile.canEat()
        })

        if(tiles.length == 0) {
            let found = new Array<Coordinate>()
            neighbours.forEach(nb => {
                let c = this.getClosestLotOfGrass(nb)
                found.push(c)
            })            
            return found[0]
        } else {
            let grass = tiles[0]
            grass.tile.tileSprite!.tint = 0xFF00FF
            return grass.c
        }        
    }


    private getTilesFiltererd(froms: Coordinate[], accepts: ((tile: Tile )=> boolean)): PlaceWithTile[] {
        let tiles = new Array<PlaceWithTile>()
        froms.forEach((c: Coordinate) => {
            let tile = this.getTile(c)
            if(accepts(tile)) {
                tiles.push({c, tile})
            }
        })

        return tiles
    }

    private getNeighbours(from: Coordinate): Coordinate[] {
        let x = from.x
        let y = from.y
        let neighbours = Array<Coordinate>()

        if (x > 1 && y > 1) {
            neighbours.push({ x: x - 1, y: y - 1 })
        }
        if (x > 1) {
            neighbours.push({ x: x - 1, y })
            neighbours.push({ x: x - 1, y: y + 1 })
        }
        if (y > 1) {
            neighbours.push({ x, y: y - 1 })
            neighbours.push({ x: x + 1, y: y - 1 })
        }
        neighbours.push({ x: x + 1, y: y + 1 })
        neighbours.push({ x, y: y + 1 })
        neighbours.push({ x: x + 1, y })

        return neighbours
    }

    private getRandomTileType(): TileType {
        const types = [TileType.GRASS, TileType.GRASSSHORT, TileType.GRASSGONE]
        return Phaser.Math.RND.weightedPick(types);
    }
}

export interface Coordinate {
    x: integer,
    y: integer
}

interface PlaceWithTile {
    c: Coordinate,
    tile: Tile
}
