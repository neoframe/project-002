import { GameObjects, Events } from 'phaser';

import * as pnjs from '../assets/pnjs';

export default class PNJ extends GameObjects.Sprite {
  name = null;
  settings = null;
  events = new Events.EventEmitter();

  constructor (scene, name, ...args) {
    super(scene, ...args);
    this.name = name;
    this.settings = pnjs[name];
  }

  create () {
    this.setTexture(`pnj-${this.name}`,
      this.getCharsetFrame('idle', 'bottom')[0]);

    this.scene.matter.add.gameObject(this, {
      ignoreGravity: true,
      isStatic: true,
      shape: { type: 'rectangle', width: 31, height: 38 },
      render: {
        sprite: { xOffset: 0, yOffset: 13 / this.settings.charset.frameHeight },
      },
      onCollideCallback: () => {
        this.scene.input.keyboard.on('keydown-SPACE',
          this.onStartDialog.bind(this));
      },
      onCollideEndCallback: () => {
        this.scene.input.keyboard.off('keydown-SPACE',
          this.onStartDialog.bind(this));
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
