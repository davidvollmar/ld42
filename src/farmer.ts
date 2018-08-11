import { Coordinate } from "./world";

export class Farmer {
    private position: Coordinate = {x: 200, y: 300}
    private rotation = 0
    private sprite : Phaser.GameObjects.Sprite | null

    constructor() {
        console.log("hoi ik ben boer bob")
        this.sprite = null
    }

    getPosition() {
        return {x: 200, y: 300}
    }

    getRotation() {
        return 0
    }

    setSprite(sprite: Phaser.GameObjects.Sprite) {
        this.sprite = sprite
    }

    getSprite(): Phaser.GameObjects.Sprite {
        return this.sprite!
    }
}