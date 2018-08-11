import { Coordinate } from "./world";

export class Sheep {
    private position: Coordinate
    private rotation: number
    private sprite: Phaser.GameObjects.Sprite | null

    constructor(position: Coordinate, rotation: number) {        
        this.position = position
        this.rotation = rotation
        this.sprite = null
    }

    setSprite(sprite: Phaser.GameObjects.Sprite) {
        this.sprite = sprite
    }

    getSprite() : Phaser.GameObjects.Sprite {
        return this.sprite!
    }

    moveRandom() {     
        if(Math.random() < 0.1) {            
            let scalar = 1

            let x = scalar * Math.random() * Math.cos(this.rotation)
            let y = scalar * Math.random() * Math.sin(this.rotation)               

            this.position.x += x
            this.position.y += y

            let randomRotation = (Math.random() * 2 * Math.PI) / 100;
            if (Math.random() < 0.5) {
                this.rotation += randomRotation;
            } else {
                this.rotation -= randomRotation;
            }
        }       
    }

    getPosition() : Coordinate{
        return this.position
    }

    getRotation() : number{
        return this.rotation
    }
}