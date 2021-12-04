import { Scene } from 'phaser';

import { DIALOGS } from '../utils/settings';
import dialogBackground from '../assets/images/dialog-background-dark.png';
import ui from '../assets/images/ui.png';
import minimalPixel from '../assets/fonts/minimalpixel.png';
import minimalPixelXml from '../assets/fonts/minimalpixel.xml';

export default class HUD extends Scene {
  constructor () {
    super({ key: 'HUDScene' });
  }

  preload () {
    this.load.spritesheet('ui', ui, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('dialog-background-dark', dialogBackground, {
      frameWidth: 20,
      frameHeight: 20,
    });
    this.load.bitmapFont('minimal-pixel', minimalPixel, minimalPixelXml);
  }

  create () {
    this.input.keyboard.on('keydown-ESC', this.hideDialog.bind(this));
    this.game.events.on('open-dialog', this.onOpenDialogModal.bind(this));
  }

  update () {}

  getDialog (dialogs, id) {
    id = id ? id : 'start';

    return dialogs.find(d => d.id === id) ||
      dialogs.find(d => d.id === 'default');
  }

  onOpenDialogModal (opts = {}) {
    if (this.dialog) {
      return;
    }

    this.game.events.emit('lock-ui');

    const dialog = this.getDialog(opts.dialogs, opts.content);

    this.dialogModal = this.rexUI.add
      .dialog({
        ...DIALOGS,
        background: this.expandableBackgrounds
          .add('dialog-background-dark', 100, 100, 300, 200),
        title: this.rexUI.add
          .label({
            background: this.expandableBackgrounds
              .add('dialog-background-dark', 100, 100, 300, 200),
            text: this.add
              .bitmapText(0, 0, 'minimal-pixel', opts.title, 24),
            space: {
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            },
          }),
        toolbar: [
          this.createDialogCloseButton(),
        ],
        actions: dialog.options?.map(this.createAction.bind(this)) || [],
        content: this.add.bitmapText(0, 0, 'minimal-pixel', dialog.text, 34),
        sizerEvents: true,
      })
      .layout()
      .on('button.click', this.onDialogButtonClick.bind(this, opts))
      .fadeIn(0);
  }

  hideDialog () {
    if (!this.dialogModal) {
      return;
    }

    this.dialogModal?.fadeOutDestroy(0);
    this.dialogModal = null;
    this.game.events.emit('unlock-ui');
  }

  createAction (opts = {}) {
    return this.rexUI.add.label({
      name: opts.end ? 'close' : 'dialog',
      text: this.add.bitmapText(0, 0, 'minimal-pixel', opts.text, 24),
    }).setData(opts).setInteractive({ useHandCursor: true });
  }

  createDialogCloseButton () {
    return this.rexUI.add.label({
      name: 'close',
      text: this.add.bitmapText(0, 0, 'minimal-pixel', 'x', 40),
      space: {
        top: 30,
        right: 10,
      },
    }).setInteractive({ useHandCursor: true });
  }

  onDialogButtonClick (opts, button) {
    switch (button.name) {
      case 'close':
        this.hideDialog();
        break;
      case 'dialog':
        this.hideDialog();

        this.onOpenDialogModal({
          ...opts,
          content: button.getData('to'),
        });

        break;
    }
  }
}
