import { GameObjects, Input } from 'phaser';

import charset from '../assets/images/charset.png';
import { PLAYER_SPEED } from '../utils/settings';

export default class Player extends GameObjects.Sprite {
  static WIDTH = 32;
  static HEIGHT = 64;
  static FRAMES = {
    IDLE: {
      RIGHT: [56, 61],
      TOP: [62, 67],
      LEFT: [68, 73],
      BOTTOM: [74, 79],
    },
    WALK: {
      RIGHT: [112, 117],
      TOP: [118, 123],
      LEFT: [124, 129],
      BOTTOM: [130, 135],
    },
  };

  direction = 'bottom';
  #canMove = true;
  #money = 0;
  #life = 100;
  #maxLife = 100;
  #mana = 100;
  #maxMana = 100;
  #flags = [];

  constructor (scene, ...args) {
    super(scene, ...args);

    scene.load
      .spritesheet('player', charset, { frameWidth: 32, frameHeight: 64 });
  }

  create () {
    this.setTexture('player', Player.FRAMES.IDLE.BOTTOM[0]);
    this.scene.matter.add.gameObject(this, {
      ignoreGravity: true,
      shape: { type: 'rectangle', width: 31, height: 38 },
      render: { sprite: { xOffset: 0, yOffset: 13 / Player.HEIGHT } },
    });
    this.scene.matter.body.setInertia(this.body, Infinity);
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

    this.scene.game.events.on('lock-ui', this.onUILock.bind(this));
    this.scene.game.events.on('unlock-ui', this.onUIUnlock.bind(this));
  }

  update () {
    this.move();
    this.setAnimation();
  }

  move () {
    if (!this.#canMove) {
      this.scene.matter.setVelocity(this.body, 0, 0);

      return;
    }

    // if (this.body.velocity.y === 0) {
    if (this.scene.cursors.left.isDown || this.scene.cursors.q.isDown) {
      this.scene.matter.setVelocityX(this.body, -PLAYER_SPEED);
      this.direction = 'left';
    } else if (
      this.scene.cursors.right.isDown ||
      this.scene.cursors.d.isDown
    ) {
      this.scene.matter.setVelocityX(this.body, PLAYER_SPEED);
      this.direction = 'right';
    } else {
      this.scene.matter.setVelocityX(this.body, 0);
    }
    // }

    // if (this.body.velocity.x === 0) {
    if (this.scene.cursors.up.isDown || this.scene.cursors.z.isDown) {
      this.scene.matter.setVelocityY(this.body, -PLAYER_SPEED);
      this.direction = 'top';
    } else if (
      this.scene.cursors.down.isDown ||
      this.scene.cursors.s.isDown
    ) {
      this.scene.matter.setVelocityY(this.body, PLAYER_SPEED);
      this.direction = 'bottom';
    } else {
      this.scene.matter.setVelocityY(this.body, 0);
    }
    // }
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

  onUILock () {
    this.#canMove = false;
  }

  onUIUnlock () {
    this.#canMove = true;
  }

  getMoney () {
    return this.#money;
  }

  addMoney (amount = 0) {
    this.#money += amount;
  }

  getLife () {
    return this.#life;
  }

  getMaxLife () {
    return this.#maxLife;
  }

  getMana () {
    return this.#mana;
  }

  getMaxMana () {
    return this.#maxMana;
  }

  hasFlag (flag) {
    return this.#flags.includes(flag);
  }

  addFlag (flag) {
    if (!this.hasFlag(flag)) {
      this.#flags.push(flag);
    }
  }
}
