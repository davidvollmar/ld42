import { Farmer } from './farmer'
import { World } from './world'

interface InitialRenderer<T> {
    render(scene: Phaser.Scene, object: T): void;
}

interface UpdateRenderer<T> {
    render(object: T): void;
}

export class WorldRenderer implements InitialRenderer<World> {
    private tileSize = 128

    render(scene: Phaser.Scene, world: World) {
        let arrays = world.getTiles()
        for (var x = 0; x < arrays.length; x++) {
            let tiles = arrays[x]
            for (var y = 0; y < tiles.length; y++) {
                let tile = tiles[y]
                let sprite = scene.add.sprite(x * this.tileSize, y * this.tileSize, tile.tileType);
                sprite.setOrigin(0, 0);
            }
        }        
    }
}

export class FarmerRender implements InitialRenderer<Farmer> {
    render(scene: Phaser.Scene, farmer: Farmer) {
        scene.anims.create({
            key: 'farmeranimation',
            frames: scene.anims.generateFrameNames('farmer', { start: 0, end: 8 }),
            frameRate: 6,
            repeat: Phaser.FOREVER
        });

        let sprite = scene.add.sprite(farmer.getPosition().x, farmer.getPosition().y, 'farmer')
        sprite.setOrigin(0, 0)
        sprite.setRotation(farmer.getRotation() + Math.PI / 2.0)

        sprite.anims.play('farmeranimation')

        farmer.setSprite(sprite)
    }
}

export class FarmerRenderUpdater implements UpdateRenderer<Farmer> {
    render(farmer: Farmer) {
        let sprite = farmer.getSprite()
        let position = farmer.getPosition()
        sprite.setPosition(position.x, position.y)
        sprite.setRotation(farmer.getRotation() + Math.PI / 2.0)
    }
}
