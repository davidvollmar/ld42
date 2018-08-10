import { GameObjects } from 'phaser';
import { Piece } from '../piece';
import { Floor } from '../floor';
import { DeadScene } from './deadScene';

export class MainScene extends Phaser.Scene {
  //graphics
  private phaserSprite: Phaser.GameObjects.Sprite | null = null;
  private man: GameObjects.Sprite | null = null;
  private cloud: GameObjects.Sprite | null = null;
  private cloud2: GameObjects.Sprite | null = null;
  private tree: GameObjects.Sprite | null = null;
  private tree2: GameObjects.Sprite | null = null;

  private background: GameObjects.Sprite | null = null;
  // private graphics: GameObjects.Graphics;
  private instructionText: GameObjects.Text | null = null;
  private additionalText: GameObjects.Text | null = null;

  //magic numbers
  private manX = 64;

  //gameplay
  private movementspeed = 1;

  //input handling  
  private downKey: Phaser.Input.Keyboard.Key | null = null;
  private upKey: Phaser.Input.Keyboard.Key | null = null;
  private leftKey: Phaser.Input.Keyboard.Key | null = null;
  private rightKey: Phaser.Input.Keyboard.Key | null = null;
  private zKey: Phaser.Input.Keyboard.Key | null = null;
  private xKey: Phaser.Input.Keyboard.Key | null = null;
  private spaceKey: Phaser.Input.Keyboard.Key | null = null;

  //things belonging to obstacle:  
  private piece: Piece | null = null;
  private pieceSprite: GameObjects.Sprite | null = null;
  private validSolutions: number[] = [];

  //tetris floors
  private floors: Array<Floor> | null = null;
  private currentFloor: Floor | null = null;

  private music: Phaser.Sound.BaseSound | null = null;

  private dying = false;
  private deathAnim: Phaser.GameObjects.Components.Animation | null = null;

  private score = 0;
  private scoreText: GameObjects.Text | null = null;

  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload(): void {
    let spritesheetconfig = {
      frameWidth: 512,
      frameHeight: 512,
      startFrame: 0,
      endFrame: 5,
      margin: 0,
      spacing: 0
    };
    this.load.spritesheet('man', '../assets/graphics/tetrisman/sprites/spritesheet.png', spritesheetconfig);
    this.load.spritesheet('dying', '../assets/graphics/tetrisman/sprites/spritesheet-dying.png', spritesheetconfig);

    this.load.image('floor', '../assets/graphics/Background/floor.png');

    this.load.image('background', '../assets/graphics/Background/Background.png');
    this.load.image('sun', '../assets/graphics/Background/Sun.png');
    this.load.image('cloud-small', '../assets/graphics/Background/Cloud-small.png');
    this.load.image('cloud-big', '../assets/graphics/Background/Cloud-big.png');
    this.load.image('tree', '../assets/graphics/Background/tree.png');
    this.load.image('tree2', '../assets/graphics/Background/tree2.png');

    this.load.image('light-red', '../assets/graphics/blocks-light/block-red.png');
    this.load.image('light-green', '../assets/graphics/blocks-light/block-green.png');
    this.load.image('light-blue', '../assets/graphics/blocks-light/block-blue.png');
    this.load.image('light-yellow', '../assets/graphics/blocks-light/block-yellow.png');
    this.load.image('active-white', '../assets/graphics/blocks-light/block-white.png');

    this.load.image('dark-red', '../assets/graphics/blocks-dark/block-red.png');
    this.load.image('dark-green', '../assets/graphics/blocks-dark/block-green.png');
    this.load.image('dark-blue', '../assets/graphics/blocks-dark/block-blue.png');
    this.load.image('dark-yellow', '../assets/graphics/blocks-dark/block-yellow.png');

    //deuntje 
    //CC-Stealing_Orchestra_-_05_-_Tetris_Beware_Boy_Videogames_Are_Evil
    //by-nc-nd/3.0/
    let audioconfig = {
      loop: true,
    };
    this.load.audio('theme', 'assets/audio/theme.mp3', audioconfig);
  }

  create(): void {
    //start music
    if (this.music == null) {
      let soundConfig: SoundConfig = { loop: true };
      this.music = this.sound.add('theme', soundConfig);
      
      this.music.play();
    }

    //initial graphics
    this.background = this.add.sprite(0, 0, 'background');
    this.background.setOrigin(0, 0);

    this.cloud = this.add.sprite(128, 128, 'cloud-small');
    this.cloud.setScale(0.5, 0.5);

    this.cloud2 = this.add.sprite(512, 256, 'cloud-big');
    this.cloud2.setScale(0.5, 0.5);

    this.tree = this.add.sprite(768, 1024 - (4 * 64) - 128, 'tree');
    this.tree.setScale(0.5);

    this.tree2 = this.add.sprite(768, 1024 - (4 * 64) - 128, 'tree2');
    this.tree2.setScale(0.5);

    this.instructionText = this.add.text(512, 128, "Z/X to rotate blocks\nArrows to move blocks\n\nFix the road before you fall!");
    this.instructionText.setScale(2);
    this.additionalText = this.add.text(2048 + 512, 128, "Space to select other block");
    this.additionalText.setScale(2);
    this.scoreText = this.add.text(768,64, "Score: " + this.score);
    this.scoreText.setScale(2);

    //player animation
    this.man = this.add.sprite(this.manX, 1024 - (4 * 64) - 64, 'man');
    this.man.setScale(0.25, 0.25);
    let walk = this.anims.create({
      key: 'manimation',
      frames: this.anims.generateFrameNames('man', { start: 0, end: 5 }),
      frameRate: 6,
      repeat: Phaser.FOREVER
    }
    );

    this.man.anims.play('manimation')

    //floor
    this.currentFloor = this.generateFloor(1, 0);
    this.floors = new Array<Floor>();
    this.floors.push(this.currentFloor);
    this.floors.push(this.generateFloor(1, 1024));

    //camera
    let cam = this.cameras.main;
    cam.setViewport(0, 0, 1024, 1024);

    //now create the hole
    //this.generateObstacle();

    //define keyboard input
    this.downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.zKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    this.xKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    this.piece = this.currentFloor.getSelectedPiece();
  }

  setScoreText(score: integer) {
    this.scoreText!.destroy();
    this.scoreText = this.add.text(768,64, "Score: " + this.score);
    this.scoreText.setScale(2);
  }

  generateFloor(nrOfMissingPieces: number, offset: number): Floor {
    // console.log("generate floor with " + nrOfMissingPieces + " missing pieces");
    return new Floor(this, 16, 4, nrOfMissingPieces, offset);
  }

  // generateObstacle(): void {
  //   //let obstacle: Obstacle = new Obstacle(600 + Math.random()*400, 200, 'piece');
  //   this.piece = new Piece(this, Piece.pickLetter(), Piece.pickColor(), 8, 4, false, 0);

  //   this.validSolutions = [1, 2];
  // }

  update(time: number, delta: number): void {
    if (this.dying) {
      if (!this.deathAnim!.isPlaying) {
        this.dying = false;
        this.scene.start('DeadScene');
      }
      return;
    }
    this.cloud!.x -= this.movementspeed;
    if (this.cloud!.x < -256) {
      this.cloud!.x = 1024 + Math.random() * 1024;
      this.cloud!.y = 128 + Math.random() * 256;
    }
    this.cloud2!.x -= this.movementspeed * 2;
    if (this.cloud2!.x < -256) {
      this.cloud2!.x = 1024 + Math.random() * 1024;
      this.cloud2!.y = 128 + Math.random() * 256;
    }

    this.tree!.x -= this.movementspeed;
    if (this.tree!.x < -256) {
      this.tree!.x = 1024 + Math.random() * 1024;
      this.tree!.y = 1024 - (4 * 64) - 128;
    }

    this.tree2!.x -= this.movementspeed;
    if (this.tree2!.x < -256) {
      this.tree2!.x = 1024 + Math.random() * 1024;
      this.tree2!.y = 1024 - (4 * 64) - 128;
    }

    if (this.instructionText) {
      this.instructionText.x--;
      if (this.instructionText.x < -1024) {
        this.instructionText.destroy();
      }
    }
    if (this.additionalText) {
      this.additionalText.x--;
      if (this.additionalText.x < -1024) {
        this.additionalText.destroy();
      }
    }

    //this reversal is a quick hack to make sure the active piece is
    //always rendered on top of the other floors
    for(var i = this.floors!.length-1; i>=0; i--) {
        let floor = this.floors![i];
        floor.drift(this.movementspeed);
        //idea, here we should be able to find the current 'tetriscoordinate' under the player
        //then, we can check in the floor if this was a 'opened' space and if it is now filled
        //here we give 128 (in px), the floor can then calculate, based on lowerright coordinate
        //what the tetriscoordinate is right under the player
        //and hence, if he trips
        if (floor.deathTrapOnThisPosition(128) && !this.dying) {
          this.dropDown(floor);
          this.startDyingAnimation();
          //this.scene.start('DeadScene');
        }
    }

    if (this.currentFloor!.getBottomRight() < 0) {
      //now, the floor is gone, so we can remove it 
      //and set current to the next in the queue 
      //and generate a new next floor
      this.currentFloor!.destroy();
      this.floors!.splice(this.floors!.indexOf(this.currentFloor!), 1);
      this.currentFloor = this.floors![0];
      this.piece = this.currentFloor.getSelectedPiece();
      this.floors!.push(this.generateFloor(2, 1024));

      this.setScoreText(this.score++);
    }
    let piece = this.piece!;

    //piece.drift(this.movementspeed);    

    // if (this.piece.x < this.manX) {//TODO if obstacle solved, generate new else, die
    //   this.piece.destroy();
    //   this.generateObstacle();
    // }

    //handle input
    if (piece != null) {
      let keyboard = Phaser.Input.Keyboard;
      if (keyboard.JustDown(this.downKey!)) {
        piece.drop();
        // if(this.currentFloor!.fitsInOpenSpace(piece)){
        //   this.nextPiece();
        //   this.currentFloor!.removeFromOpenSpace(piece);
        //   return;
        // }        
      }
      if (keyboard.JustDown(this.upKey!)) {
        //piece.moveUp();
      }
      if (keyboard.JustDown(this.zKey!)) {
        piece.rotateleft();
      }
      if (keyboard.JustDown(this.xKey!)) {
        piece.rotateright();
      }
      if (keyboard.JustDown(this.leftKey!)) {
        piece.moveLeft();
      }
      if (keyboard.JustDown(this.rightKey!)) {
        piece.moveRight();
      }
      if (keyboard.JustDown(this.spaceKey!)) {
        this.nextPiece();
      }
    }
  }

  dropDown(floor: Floor): void {
    this.dying = true;
    this.man!.x += 32;
    this.man!.y += 256;
    this.man!.depth = 1000;
  }

  startDyingAnimation() {
    let dying = this.anims.create({
      key: 'rip',
      frames: this.anims.generateFrameNames('dying', { start: 0, end: 5 }),
      frameRate: 4,
      repeat: 0
    });
    this.deathAnim = this.man!.anims;
    this.deathAnim.play('rip')
  }

  nextPiece(): void {
    this.currentFloor!.selectNextPiece();
    this.piece = this.currentFloor!.getSelectedPiece();
  }
}