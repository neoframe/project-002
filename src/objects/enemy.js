import { Events, GameObjects, Math as PMath } from 'phaser';

import * as enemies from '../assets/enemies';

export default class Enemy extends GameObjects.Sprite {
  #life = 100;
  #dead = false;
  #damaged = false;
  #attacking = false;
  events = new Events.EventEmitter();

  constructor (scene, player, name, ...args) {
    super(scene, ...args);
    this.name = name;
    this.player = player;
    this.settings = enemies[name];
    this.#life = this.settings.maxLife ?? 100;
  }

  create () {
    this
      .setTexture(this.getTextureName(), 0)
      .createBody()
      .createAnimations();

    this.lifebar = this.scene.add
      .rectangle(this.x, this.y - 40, this.width * 0.6, 3, 0xFF0000)
      .setOrigin(0)
      .setVisible(false);

    this.anims.play(this.getAnimationName('idle'), true);

    return this;
  }

  createBody () {
    this.scene.matter.add.gameObject(this, {
      ignoreGravity: true,
      friction: 1,
      mass: 1000,
      shape: {
        type: 'rectangle',
        width: this.settings.charset.bodyWidth,
        height: this.settings.charset.bodyHeight,
      },
      render: {
        sprite: { xOffset: 0, yOffset: 13 / this.settings.charset.frameHeight },
      },
    });
    this.scene.matter.body.setInertia(this.body, Infinity);
    this.scene.add.existing(this);

    return this;
  }

  createAnimations () {
    ['idle', 'walk'].forEach(anim => {
      const config = this.settings.charset.frames[anim];
      const { frames = config, frameRate = 10, repeat = -1 } = config;

      this.anims.create({
        key: this.getAnimationName(anim),
        frames: this.anims.generateFrameNumbers(this.getTextureName(), {
          start: frames?.[0],
          end: frames?.[1],
        }),
        frameRate,
        repeat,
      });
    });

    return this;
  }

  getTextureName () {
    return `enemy-${this.name}`;
  }

  getAnimationName (type) {
    return `${this.getTextureName()}-${type}`;
  }

  update () {
    if (this.player.x > this.x) {
      this.setFlipX(false);
    } else {
      this.setFlipX(true);
    }

    const distanceToPlayer = PMath.Distance
      .Between(this.x, this.y, this.player.x, this.player.y);

    if (distanceToPlayer < 200) {
      const speed = 1.5;
      const angle = PMath.Angle
        .Between(this.x, this.y, this.player.x, this.player.y);

      this.scene.matter.setVelocity(
        this.body,
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
      this.setAnimation(this.getAnimationName('walk'));
    } else {
      this.setAnimation(this.getAnimationName('idle'));
    }

    if (distanceToPlayer < 50) {
      this.attack();
    } else {
      this.attackTimer?.destroy();
    }

    this.lifebar.setPosition(
      this.x - (this.width * 0.6) / 2,
      this.y - 40
    );
    this.lifebar.width = (this.width * 0.6) *
      (this.#life / this.settings.maxLife);
  }

  setAnimation (name) {
    if (name !== this.anims.getName()) {
      this.anims.play(name, true);
    }
  }

  attack () {
    if (this.#attacking) {
      return;
    }

    this.#attacking = true;
    this.attackTimer?.destroy();
    this.attackTimer = this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        this.player.damage(this.settings.dps ?? 20 / 2);
        this.#attacking = false;
      },
    });
  }

  damage (dps) {
    this.#damaged = true;
    this.#life = Math.max(0, this.#life - dps);
    this.lifebar.setVisible(true);

    if (!this.#life) {
      this.#dead = true;
      this.events.emit('die');
    }
  }

  isDead () {
    return this.#dead;
  }

  destroy () {
    this.lifebar.destroy();
    super.destroy();
  }
}
