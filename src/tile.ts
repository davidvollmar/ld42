export class Tile {
    public tileType: TileType
    public hasFence: Boolean

    constructor(tileType: TileType) {
        this.tileType = tileType
        this.hasFence = false
    }
}

export const enum Direction {
    NORTH = "north",
    EASTH = "east",
    SOUTH = "south",
    WEST = "west"
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