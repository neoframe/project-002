import { GameObjects, Scene } from 'phaser';

import { FONT } from '../utils/settings';
import dialogBackground from '../assets/images/dialog-background.png';
import ui from '../assets/images/ui.png';

export default class HUD extends Scene {
  inputLocked = false;

  constructor () {
    super({ key: 'HUDScene' });
  }

  preload () {
    this.load.spritesheet('ui', ui, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('dialog-background', dialogBackground, {
      frameWidth: 20,
      frameHeight: 20,
    });
  }

  create () {
    this.input.keyboard.on('keydown-ESC', () => {
      this.hideDialog();
    });
  }

  update () {}

  showDialog (opts = {}) {
    if (this.dialog) {
      return;
    }

    this.inputLocked = true;

    const content = new GameObjects
      .Text(this, 0, 0, opts.content, FONT);
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
          titleLeft: 40,
          titleRight: 40,
          contentLeft: 20,
          contentRight: 20,
          bottom: 40,
          top: -20,
        },
        expand: {
          title: false,
          content: false,
        },
        align: {
          title: 'left',
          content: 'left',
          toolbar: 'right',
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
            name: 'close',
            text: this.add.image(0, 0, 'ui', 0),
            space: {
              top: 30,
              right: 10,
            },
          }),
        ],
        content,
        sizerEvents: true,
      })
      .layout()
      .on('button.click', button => {
        switch (button.name) {
          case 'close':
            typer.destroy();
            this.hideDialog();
        }
      })
      .on('fadein.complete', () => {
        this.add.existing(content);
        typer.start(opts.content, 50);
      })
      .fadeIn(200);
  }

  hideDialog () {
    if (!this.dialog) {
      return;
    }

    this.dialog?.fadeOutDestroy(100);
    this.dialog = null;
    this.inputLocked = false;
  }

  isInputLocked () {
    return this.inputLocked;
  }
}
