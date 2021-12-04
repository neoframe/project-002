import { GameObjects } from 'phaser';
import OutlinePostFx from 'phaser3-rex-plugins/plugins/outlinepipeline.js';

import * as pnjs from '../assets/pnjs';
import { FONT } from '../utils/settings';

export default class PNJ extends GameObjects.Sprite {
  name = null;
  settings = null;

  constructor (scene, name, ...args) {
    super(scene, ...args);
    this.name = name;
    this.settings = pnjs[name];
  }

  create () {
    this.setPostPipeline(OutlinePostFx);
    this.setInteractive({
      useHandCursor: true,
      pixelPerfect: true,
    });

    this.setTexture(`pnj-${this.name}`,
      this.getCharsetFrame('idle', 'bottom')[0]);

    this.scene.matter.add.gameObject(this, {
      ignoreGravity: true,
      isStatic: true,
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

    ['idle'].forEach(anim => {
      ['right', 'top', 'left', 'bottom'].forEach(dir => {
        if (!this.scene.anims.exists(`pnj-${this.name}-${anim}-${dir}`)) {
          const frames = this.getCharsetFrame(anim, dir);

          this.scene.anims.create({
            key: `pnj-${this.name}-${anim}-${dir}`,
            frames: this.scene.anims.generateFrameNumbers(`pnj-${this.name}`, {
              start: frames[0],
              end: frames[1],
            }),
            frameRate: 10,
            repeat: -1,
          });
        }
      });
    });

    this.anims.play(`pnj-${this.name}-idle-bottom`, true);

    // Add label
    this.label = this.scene.rexUI.add.sizer({
      x: this.x,
      y: this.y - this.settings.charset.bodyHeight,
    }).add(this.scene.rexUI.add.label({
      background: this.scene.rexUI.add
        .roundRectangle(0, 0, 2, 2, 5, 0x000000)
        .setAlpha(0.5)
        .setDepth(100),
      text: this.scene.add.text(0, 0, this.settings.name,
        { ...FONT, fontSize: 8, color: '#ffffff' })
        .setDepth(101),
      space: {
        left: 10,
        right: 10,
        top: 5,
        bottom: 5,
      },
    })).layout().setAlpha(0);

    this.on('pointerover', () => {
      this.scene.rexOutlinePipeline.add(this, {
        quality: 0.05,
        thickness: 4,
      });
      this.scene.tweens.add({
        targets: this.label,
        alpha: 1,
        y: this.y - this.settings.charset.bodyHeight - 10,
        duration: 100,
        ease: 'Power1',
      });
    });

    this.on('pointerout', () => {
      this.scene.rexOutlinePipeline.remove(this);
      this.scene.tweens.add({
        targets: this.label,
        alpha: 0,
        y: this.y - this.settings.charset.bodyHeight,
        duration: 100,
        ease: 'Power1',
      });
    });

    this.on('pointerup', () => {
      if (this.scene.scene.get('HUDScene').isInputLocked()) {
        return;
      }

      this.onStartDialog();
    });

    return this;
  }

  getCharsetFrame (action, direction) {
    return this.settings.charset.frames[action][direction];
  }

  onStartDialog () {
    this.scene.getHUD().showDialog({
      title: 'Martine',
      content: 'Simon aime moi stp',
    });
  }
}
