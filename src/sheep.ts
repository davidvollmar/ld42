import { Coordinate } from "./world";

export class Sheep extends Phaser.GameObjects.GameObject {
    private sprite: Phaser.Physics.Arcade.Sprite
    private target: Phaser.GameObjects.PathFollower | null = null

    constructor(scene: Phaser.Scene, pos: Phaser.Geom.Point) {
        super(scene, "beeh")

        this.sprite = this.scene.physics.add.sprite(pos.x, pos.y, 'sheep')
        let rotation = Math.random() * Math.PI * 2
        this.sprite.setRotation(rotation)
        let velocity = this.scene.physics.velocityFromRotation(rotation)
        this.sprite.setVelocity(velocity.x, velocity.y)
        this.sprite.play('sheep_animation')
    }

    getSprite(): Phaser.Physics.Arcade.Sprite {
        return this.sprite
    }

    hasTarget() {
        return this.target != null
    }

    moveTo(c: Coordinate) {
        var path = new Phaser.Curves.Path(this.sprite.x, this.sprite.y).lineTo(c.x, c.y)
        this.target = this.scene.add.follower(path, this.sprite.x, this.sprite.y, 'path')
        this.target.setVisible(true)
        this.target.setOrigin(0,0)
        this.target.startFollow()
    }

    moveRandom() {
        let randomRotation = (Math.random() * 2 * Math.PI) / 100
        let rotation = this.sprite.rotation
        if (Math.random() < 0.5) {
            rotation += randomRotation
        } else {
            rotation -= randomRotation
        }

        let velocity = this.scene.physics.velocityFromRotation(rotation)
        this.sprite.setRotation(rotation)
        this.sprite.setVelocity(velocity.x, velocity.y)
    }
}