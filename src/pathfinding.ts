import * as Easystar from "EasyStarjs"
import { World, Coordinate } from "./world";
import { Tile } from "./tile"

export class PathFinding {
    private easystar: Easystar.js

    constructor(world: World) {
        this.easystar = new Easystar.js();

        this.easystar.setGrid(this.makeGrid(world))
        this.easystar.setAcceptableTiles(0)
    }

    makeGrid(world: World): Array<Array<number>> {
        let grid = Array<Array<number>>()
        let tiles = world.getTiles()

        for (let x = 0 ; x < tiles.length; x++) {
            grid.push(new Array<number>())
            for (let y = 0; y < tiles[x].length; y++) {
                let tile = tiles[x][y]

                if (tile.isPassable()) {
                    grid[x].push(0)
                } else {
                    grid[x].push(1)
                }
            }
        }

        return grid
    }

    updateWorld(world: World) {
        this.easystar.setGrid(this.makeGrid(world))
    }

    async findPath(start: Coordinate, end: Coordinate): Promise<Path> {
        return new Promise<Path>((resolve, reject) => {
            this.easystar.findPath(start.x, start.y, end.x, end.y, (path: Path) => {
                if (path != null) {
                    return resolve(path)
                } else {
                    return reject("no path found")
                }
            })
            this.easystar.calculate()
        })
    }
}

export type Path = { x: number, y: number }[]