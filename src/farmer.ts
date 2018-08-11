import { Coordinate } from "./world";

export class Farmer extends Phaser.GameObjects.GameObject {
    private position: Coordinate = {x: 200, y: 300}
    private rotation = 0
    private sprite : Phaser.GameObjects.Sprite | null

    constructor(scene: Phaser.Scene) {
        super(scene, "farmerbob")
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