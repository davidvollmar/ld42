export class Wolf extends Phaser.GameObjects.GameObject {
    
    constructor(scene: Phaser.Scene, pos: Phaser.Geom.Point) {
        super(scene, "wolf")    

        // ??
        Phaser.Geom.Rectangle.Inflate(Phaser.Geom.Rectangle.Clone(this.scene.physics.world.bounds), -100, -100);

        let sprite = this.scene.physics.add.sprite(pos.x, pos.y, 'wolf');
        let rotation = Math.random() * Math.PI * 2;
        sprite.setRotation(rotation);
        let velocity = this.scene.physics.velocityFromRotation(rotation);
        sprite.setVelocity(velocity.x, velocity.y);
        sprite.play('wolf_animation');
    }
}
