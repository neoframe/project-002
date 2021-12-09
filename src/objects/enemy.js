import { GameObjects, Math as PMath } from 'phaser';

import * as enemies from '../assets/enemies';

export default class Enemy extends GameObjects.Sprite {
  constructor (scene, player, name, ...args) {
    super(scene, ...args);
    this.name = name;
    this.player = player;
    this.settings = enemies[name];
  }

  create () {
    this
      .setTexture(this.getTextureName(), 0)
      .createBody()
      .createAnimations();

    this.anims.play(this.getAnimationName('walk'), true);

    return this;
  }

  createBody () {
    this.scene.matter.add.gameObject(this, {
      ignoreGravity: true,
      // isStatic: true,
      friction: 1,
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
    ['walk'].forEach(anim => {
      const frames = this.settings.charset.frames[anim];

      this.anims.create({
        key: this.getAnimationName(anim),
        frames: this.anims.generateFrameNumbers(this.getTextureName(), {
          start: frames[0],
          end: frames[1],
        }),
        frameRate: this.settings.charset.animations?.frameRate ?? 10,
        repeat: this.settings.charset.animations?.repeat ?? -1,
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

  preUpdate () {
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
      // this.anims.play(this.getAnimationName('walk'), true);
    } else {
      this.scene.matter.setVelocity(this.body, 0, 0);
      // this.anims.stop();
    }
  }
}
