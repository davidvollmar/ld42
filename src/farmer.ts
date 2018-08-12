import { Coordinate } from "./world";

export class Farmer extends Phaser.GameObjects.GameObject {
    private position: Coordinate = {x: 200, y: 300}
    private rotation = 0
    private sprite : Phaser.GameObjects.Sprite | null

    constructor(scene: Phaser.Scene) {
        super(scene, "farmerbob")
        this.sprite = null
    }

    getPosition() {
        return this.position
    }

    getRotation() {
        return this.rotation
    }

    setSprite(sprite: Phaser.GameObjects.Sprite) {
        this.sprite = sprite
    }

    getSprite(): Phaser.GameObjects.Sprite {
        return this.sprite!
    }
}