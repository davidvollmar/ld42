import { Sheep } from './sheep'
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

        let fences = scene.physics.add.staticGroup();
        fences.create(0, 0, 'fence');
        fences.create(1000, 0, 'fence');
    }
}

export class SheepRenderer implements InitialRenderer<Array<Sheep>> {
    render(scene: Phaser.Scene, sheeps: Array<Sheep>) {
        scene.anims.create({
            key: 'beehmation',
            frames: scene.anims.generateFrameNames('sheep', { start: 0, end: 3 }),
            frameRate: 6,
            repeat: Phaser.FOREVER
        });

        sheeps.forEach(sheep => {
            let sprite = scene.add.sprite(sheep.getPosition().x, sheep.getPosition().y, 'sheep')
            sprite.setOrigin(0, 0)
            sprite.setRotation(sheep.getRotation() + Math.PI / 2.0)

            sprite.anims.play('beehmation')

            sheep.setSprite(sprite)

            //physics
            scene.physics.add.collider(sheep, fences);
        })
    }
}

export class SheepRenderUpdater implements UpdateRenderer<Array<Sheep>> {
    render(sheeps: Array<Sheep>) {
        sheeps.forEach(sheep => {
            let sprite = sheep.getSprite()
            let position = sheep.getPosition()
            sprite.setPosition(position.x, position.y)
            sprite.setRotation(sheep.getRotation() + Math.PI / 2.0)
        })
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
