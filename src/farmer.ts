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

    handleEvent(args: any) {
        console.log(`Farmer is ${this.type}`)
        switch (args) {
            case "up": 
                this.position.y -= 5
                break
            case "down":
                this.position.y += 5
                break
            case "left":
                this.position.x -= 5
                break
            case "right":
                this.position.x += 5
                break
            case "action":
                console.log("doing an action")
                break
            default:
                console.log(`unhandled event ${args}`)        
        }        
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