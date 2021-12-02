import { Scene } from 'phaser';

import dialogBackground from '../assets/images/dialog-background.png';

export default class HUD extends Scene {
  constructor () {
    super({ key: 'HUDScene' });
  }

  preload () {
    this.load.spritesheet('dialog-background', dialogBackground, {
      frameWidth: 20,
      frameHeight: 20,
    });
  }

  create () {
    this.background = this.expandableBackgrounds
      .add('dialog-background', 100, 100, 300, 200);
    this.add.existing(this.background);
  }

  update () {}

  showDialog (opts = {}) {
    this.dialog = this.rexUI.add
      .dialog({
        anchor: {
          centerX: 'center',
          bottom: 'bottom-20',
        },
        spaces: {
          title: 10,
          left: 10,
          right: 10,
          bottom: 10,
          top: 10,
        },
        expand: {
          title: false,
        },
        background: this.add
          .rectangle(0, 0, 100, 100, 0xFFFFFF),
        title: this.rexUI.add
          .label({
            text: this.add
              .text(0, 0, opts.title, { color: '#000', fontSize: '70px' }),
          }),
        content: this.add
          .text(0, 0, opts.content, { color: '#000', fontSize: '70px' }),
      })
      .layout()
      .popUp(0);
  }

  hideDialog () {
    this.dialog?.destroy();
  }
}
