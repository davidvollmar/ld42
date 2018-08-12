import { TileType } from './tile'

export class Loader {

    private scene: Phaser.Scene

    constructor(scene: Phaser.Scene) {
        this.scene = scene

        this.loadSpriteTiles()
        this.loadSpriteSheep()
        this.loadFarmer()
        this.loadWolf()
    }

    loadSpriteTiles() {
        this.scene.load.image(TileType.GRASS, 'assets/Graphics/LandTiles/Grass.png')
        this.scene.load.image(TileType.GRASSGONE, 'assets/Graphics/LandTiles/GrassGone.png')
        this.scene.load.image(TileType.GRASSSHORT, 'assets/Graphics/LandTiles/GrassShort.png')
        this.scene.load.image(TileType.WATER0, 'assets/Graphics/LandTiles/Water0.png')
        this.scene.load.image(TileType.WATER1N, 'assets/Graphics/LandTiles/Water1N.png')
        this.scene.load.image(TileType.WATER1E, 'assets/Graphics/LandTiles/Water1E.png')
        this.scene.load.image(TileType.WATER1S, 'assets/Graphics/LandTiles/Water1S.png')
        this.scene.load.image(TileType.WATER1W, 'assets/Graphics/LandTiles/Water1W.png')
        this.scene.load.image(TileType.WATERPAR, 'assets/Graphics/LandTiles/WaterPar.png')
        this.scene.load.image(TileType.WATERCOR, 'assets/Graphics/LandTiles/WaterCor.png')
        this.scene.load.image(TileType.WATER3, 'assets/Graphics/LandTiles/Water3.png')
        this.scene.load.image(TileType.WATER4, 'assets/Graphics/LandTiles/Water4.png')
        this.scene.load.image(TileType.FENCEWE, 'assets/Graphics/LandTiles/FenceWE.png')
        this.scene.load.image(TileType.FENCENS, 'assets/Graphics/LandTiles/FenceNS.png')
        this.scene.load.image(TileType.FENCET, 'assets/Graphics/LandTiles/FenceT.png')
        this.scene.load.image(TileType.FENCECOR, 'assets/Graphics/LandTiles/FenceCor.png')
        this.scene.load.image(TileType.FENCECROSS, 'assets/Graphics/LandTiles/FenceCross.png')
    }

    loadSpriteSheep() {
        let spritesheetconfig = {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 4,
            margin: 0,
            spacing: 0
        };
        this.scene.load.spritesheet('sheep', 'assets/Graphics/Sheep.png', spritesheetconfig);
    }

    loadFarmer() {
        let spritesheetconfig = {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 8,
            margin: 0,
            spacing: 0
        };
        this.scene.load.spritesheet('farmer-left', 'assets/Graphics/farmer-left.png', spritesheetconfig);
        this.scene.load.spritesheet('farmer-right', 'assets/Graphics/farmer-right.png', spritesheetconfig);
        this.scene.load.spritesheet('farmer-up', 'assets/Graphics/farmer-up.png', spritesheetconfig);
        this.scene.load.spritesheet('farmer-down', 'assets/Graphics/farmer-down.png', spritesheetconfig);
    }

    loadWolf() {
        let spritesheetconfig = {
            frameWidth: 64,
            frameHeight: 64,
            startFrame: 0,
            endFrame: 9,
            margin: 0,
            spacing: 0
        };
        this.scene.load.spritesheet('wolf', 'assets/Graphics/Wolf.png', spritesheetconfig);
    }
}