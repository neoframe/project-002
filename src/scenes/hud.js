import { Scene } from 'phaser';

export default class HUD extends Scene {
  constructor () {
    super({ key: 'HUDScene' });
  }

  create () {
  }

  update () {
  }

  showDialog (opts = {}) {
    this.dialog = this.rexUI.add
      .dialog({
        anchor: {
          centerX: 'center',
          bottom: 'bottom-20',
        },
        title: this.add.text(0, 0, opts.title, { color: '#fff' }),
        content: this.add.text(0, 0, opts.content, { color: '#fff' }),
        background: this.add.rectangle(0, 0, 100, 100, 0x000000),
      })
      .layout()
      .popUp(0);
  }

  hideDialog () {
    this.dialog?.destroy();
  }
}
