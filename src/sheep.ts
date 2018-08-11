import { Coordinate } from "./world";

export class Sheep extends Phaser.GameObjects.GameObject {    
    private rotation: number
    private sprite: Phaser.Physics.Arcade.Sprite

    constructor(scene: Phaser.Scene, rotation: number, sprite: Phaser.Physics.Arcade.Sprite) {
        super(scene, "beeh")        
        this.rotation = rotation
        this.sprite = sprite
    }

    getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.sprite
    }

    moveRandom() {
        let randomRotation = (Math.random() * 2 * Math.PI) / 100;
        if (Math.random() < 0.5) {
            this.rotation += randomRotation;
        } else {
            this.rotation -= randomRotation;
        }

        let velocity = this.scene.physics.velocityFromRotation(this.rotation);
        this.sprite.setRotation(this.rotation)
        this.sprite.setVelocity(velocity.x, velocity.y);

    }
}