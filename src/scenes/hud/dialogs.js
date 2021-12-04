import { DIALOGS } from '../../utils/settings';
import dialogBackground from '../../assets/images/dialog-background-dark.png';

export default class DialogsUI {
  scene = null;
  dialog = null;
  dialogModal = null;

  constructor (scene) {
    this.scene = scene;
  }

  preload () {
    this.scene.load.spritesheet('dialog-background-dark', dialogBackground, {
      frameWidth: 20,
      frameHeight: 20,
    });
  }

  create () {
    this.scene.game.events.on('open-dialog', this.onOpenDialogModal.bind(this));
    this.scene.input.keyboard.on('keydown-ESC', this.hideDialog.bind(this));
  }

  getDialog (dialogs, id) {
    id = id ? id : 'start';

    return dialogs.find(d => d.id === id) ||
      dialogs.find(d => d.id === 'default');
  }

  onOpenDialogModal (opts = {}) {
    if (this.dialogModal) {
      return;
    }

    this.scene.game.events.emit('lock-ui');

    const dialog = this.getDialog(opts.dialogs, opts.content);

    this.dialogModal = this.scene.rexUI.add
      .dialog({
        ...DIALOGS,
        background: this.scene.expandableBackgrounds
          .add('dialog-background-dark', 100, 100, 300, 200),
        title: this.scene.rexUI.add
          .label({
            background: this.scene.expandableBackgrounds
              .add('dialog-background-dark', 100, 100, 300, 200),
            text: this.scene.add
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
        content: this.scene.add
          .bitmapText(0, 0, 'minimal-pixel', dialog.text, 34),
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
    this.scene.game.events.emit('unlock-ui');
  }

  createAction (opts = {}) {
    return this.scene.rexUI.add.label({
      name: opts.end ? 'close' : 'dialog',
      text: this.scene.add.bitmapText(0, 0, 'minimal-pixel', opts.text, 24),
    }).setData(opts).setInteractive({ useHandCursor: true });
  }

  createDialogCloseButton () {
    return this.scene.rexUI.add.label({
      name: 'close',
      text: this.scene.add.bitmapText(0, 0, 'minimal-pixel', 'x', 40),
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

  destroy () {
    this.scene.game.events
      .off('open-dialog', this.onOpenDialogModal.bind(this));
    this.scene.input.keyboard
      .off('keydown-ESC', this.hideDialog.bind(this));

    this.dialogModal?.destroy();
  }
}
