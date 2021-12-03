import { GameObjects, Scene } from 'phaser';

import dialogBackground from '../assets/images/dialog-background.png';
import { FONT } from '../utils/settings';

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

  create () {}

  update () {}

  showDialog (opts = {}) {
    const content = new GameObjects
      .Text(this, 0, 0, opts.content, { ...FONT, fontSize: 32 });
    const typer = this.rexTextTyping.add(content);

    this.dialog = this.rexUI.add
      .dialog({
        anchor: {
          centerX: 'center',
          bottom: 'bottom-30',
        },
        width: 800,
        space: {
          title: 20,
          left: 40,
          right: 40,
          bottom: 40,
          top: -20,
          toolbarItem: -30,
        },
        expand: {
          title: false,
          content: false,
        },
        align: {
          title: 'left',
          content: 'left',
        },
        background: this.expandableBackgrounds
          .add('dialog-background', 100, 100, 300, 200),
        title: this.rexUI.add
          .label({
            background: this.expandableBackgrounds
              .add('dialog-background', 100, 100, 300, 200),
            text: this.add
              .text(0, 0, opts.title, FONT),
            space: {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            },
          }),
        toolbar: [
          this.rexUI.add.label({
            text: this.add.text(0, 0, 'x'),
          }),
        ],
        content,
        sizerEvents: true,
      })
      .layout()
      .on('popup.complete', () => {
        typer.start(opts.content, 20);
      })
      .popUp(100);

    this.add.existing(content);
  }

  hideDialog () {
    this.dialog?.destroy();
  }
}
