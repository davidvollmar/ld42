export class Tile {
    public tileType: TileType
    public tileSprite: Phaser.GameObjects.Sprite | null = null
    public fenceSprite: Phaser.GameObjects.Sprite | null = null
    public hasFence: Boolean

    constructor(tileType: TileType) {
        this.tileType = tileType
        this.hasFence = false
    }

    isPassable(): boolean {
        if (this.hasFence) {
            return false
        } else {
            return !Array(TileType.WATER0, TileType.WATER1N, TileType.WATER1E, TileType.WATER1S, TileType.WATER1W, TileType.WATER3, TileType.WATER4, TileType.WATERCOR, TileType.WATERPAR).some(t => t == this.tileType)
        }
    }

    canPlaceFence(): boolean {
        if (this.hasFence) {
            return false
        } else {
            return !Array(TileType.WATER0, TileType.WATER1N, TileType.WATER1E, TileType.WATER1S, TileType.WATER1W, TileType.WATER3, TileType.WATER4, TileType.WATERCOR, TileType.WATERPAR).some(t => t == this.tileType)
        }
    }

    placeFence() {
        this.hasFence = true;
    }

    removeFence() {
        this.hasFence = false;
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
    WATER1N = "water_1N",
    WATER1E = "water_1E",
    WATER1S = "water_1S",
    WATER1W = "water_1W",
    WATERPAR = "water_parallel",
    WATERCOR = "water_corner",
    WATER3 = "water_3",
    WATER4 = "water_4",
    FENCEWE = "fence_we",
    FENCENS = "fence_ns",
    FENCET = "fence_t",
    FENCECOR = "fence_cor",
    FENCECROSS = "fence_cross"
}