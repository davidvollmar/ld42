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

        tiles.forEach((t: Tile, c: Coordinate) => {
            if (grid[c.x] === undefined) {
                grid.push(new Array<number>())
            }
            if (t.hasFence) {
                grid[c.x].push(1)
            } else {
                grid[c.x].push(0)
            }
        }
        );
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