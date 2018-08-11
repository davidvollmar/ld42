export class Keyboard {    
    private downKey: Phaser.Input.Keyboard.Key
    private upKey: Phaser.Input.Keyboard.Key
    private rightKey: Phaser.Input.Keyboard.Key
    private leftKey: Phaser.Input.Keyboard.Key
    private spaceKey: Phaser.Input.Keyboard.Key

    constructor(scene: Phaser.Scene) {        
        this.downKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.upKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.leftKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.rightKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);    
        this.spaceKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);            
    }

    update() {
        let keyboard = Phaser.Input.Keyboard;

        if (keyboard.JustDown(this.downKey)) {
            // down
            console.log('down')
          }
          if (keyboard.JustDown(this.upKey)) {
            // up
            console.log('up')
          }
          if (keyboard.JustDown(this.leftKey)) {
            // left
            console.log('left')
          }
          if (keyboard.JustDown(this.rightKey)) {
            // right
            console.log('right')
          }
          if (keyboard.JustDown(this.spaceKey)) {
            // jump / shear / beeh
            console.log('space')
          }
    }
}