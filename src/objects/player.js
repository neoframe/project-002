import { GameObjects, Input } from 'phaser';

import charset from '../assets/images/charset.png';
import { PLAYER_SPEED } from '../utils/settings';

export default class Player extends GameObjects.Sprite {
  static FRAMES = {
    IDLE: {
      RIGHT: [0, 5],
      TOP: [6, 11],
      LEFT: [12, 17],
      BOTTOM: [18, 23],
    },
    WALK: {
      RIGHT: [24, 29],
      TOP: [30, 35],
      LEFT: [36, 41],
      BOTTOM: [42, 47],
    },
  };

  direction = 'bottom';

  constructor (scene, ...args) {
    super(scene, ...args);

    scene.load
      .spritesheet('player', charset, { frameWidth: 32, frameHeight: 64 });
  }

  create () {
    this.setTexture('player', Player.FRAMES.IDLE.BOTTOM[0]);
    this.scene.physics.add.existing(this);
    this.scene.add.existing(this);

    // Init keys
    this.scene.cursors = this.scene.input.keyboard.createCursorKeys();
    ['z', 'q', 's', 'd'].forEach(k => {
      this.scene.cursors[k] = this.scene.input.keyboard
        .addKey(Input.Keyboard.KeyCodes[k.toUpperCase()]);
    });

    // Init animations
    ['idle', 'walk'].forEach(anim => {
      ['right', 'top', 'left', 'bottom'].forEach(dir => {
        const frames = Player.FRAMES[anim.toUpperCase()][dir.toUpperCase()];

        this.scene.anims.create({
          key: `player-${anim}-${dir}`,
          frames: this.scene.anims.generateFrameNumbers('player', {
            start: frames[0],
            end: frames[1],
          }),
          frameRate: 10,
          repeat: -1,
        });
      });
    });

    this.anims.play('player-idle-bottom', true);
  }

  update () {
    this.move();
    this.setAnimation();
  }

  move () {
    if (this.scene.cursors.left.isDown || this.scene.cursors.q.isDown) {
      this.body.setVelocityX(-PLAYER_SPEED);
      this.direction = 'left';
    } else if (this.scene.cursors.right.isDown || this.scene.cursors.d.isDown) {
      this.body.setVelocityX(PLAYER_SPEED);
      this.direction = 'right';
    } else {
      this.body.setVelocityX(0);
    }

    if (this.scene.cursors.up.isDown || this.scene.cursors.z.isDown) {
      this.body.setVelocityY(-PLAYER_SPEED);
      this.direction = 'top';
    } else if (this.scene.cursors.down.isDown || this.scene.cursors.s.isDown) {
      this.body.setVelocityY(PLAYER_SPEED);
      this.direction = 'bottom';
    } else {
      this.body.setVelocityY(0);
    }
  }

  getAnimationName () {
    const { x, y } = this.body.velocity;

    if (x === 0 && y === 0) {
      return `player-idle-${this.direction}`;
    } else {
      return `player-walk-${this.direction}`;
    }
  }

  setAnimation () {
    const animationName = this.getAnimationName();

    if (animationName !== this.anims.getName()) {
      this.anims.play(animationName, true);
    }
  }
}
