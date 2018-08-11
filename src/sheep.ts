import { Coordinate } from "./world";

export class Sheep {
    private position: Coordinate
    private angle: number
    private sprite: Phaser.GameObjects.Sprite | null

    constructor(position: Coordinate, angle: number) {
        console.log("baah")
        this.position = position
        this.angle = angle
        this.sprite = null
    }

    setSprite(sprite: Phaser.GameObjects.Sprite) {
        this.sprite = sprite
    }

    getSprite() : Phaser.GameObjects.Sprite {
        return this.sprite!
    }

    moveRandom() {
        let scalar = 1

        let x = scalar * Math.random() * Math.cos(this.angle * Math.PI / 180.0)
        let y = scalar * Math.random() * Math.sin(this.angle * Math.PI / 180.0)               

        this.position.x += x
        this.position.y += y

        this.angle += Math.random() * 10 - 5
    }

    getPosition() : Coordinate{
        return this.position
    }

    getAngle() : integer{
        return this.angle
    }
}