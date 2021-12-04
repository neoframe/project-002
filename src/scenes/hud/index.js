import { Scene } from 'phaser';

import minimalPixel from '../../assets/fonts/minimalpixel.png';
import minimalPixelXml from '../../assets/fonts/minimalpixel.xml';
import DialogsUI from './dialogs';
import PlayerUI from './player';

export default class HUD extends Scene {
  constructor () {
    super({ key: 'HUDScene' });
    this.dialogsUI = new DialogsUI(this);
    this.playerUI = new PlayerUI(this);
  }

  preload () {
    this.playerUI.preload?.();
    this.dialogsUI.preload?.();
    this.load.bitmapFont('minimal-pixel', minimalPixel, minimalPixelXml);
  }

  create () {
    this.playerUI.create?.();
    this.dialogsUI.create?.();
  }

  update () {
    this.playerUI.update?.();
    this.dialogsUI.update?.();
  }

  destroy (...args) {
    this.playerUI.destroy?.();
    this.dialogsUI.destroy?.();
    super.destroy(...args);
  }
}
