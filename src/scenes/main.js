import { Scene } from 'phaser';

import { ZOOM } from '../utils/settings';
import Player from '../objects/player';
import Map from '../objects/map';

export default class MainScene extends Scene {
  constructor () {
    super({ key: 'MainScene' });
  }

  preload () {
    this.player = new Player(this);
    this.map = new Map(this, this.player);
  }

  create () {
    this.player.create();
    this.map.create();

    console.log(this.map.getPlayerDepth());

    this.player.setDepth(this.map.getPlayerDepth());
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setZoom(ZOOM);
  }

  update () {
    this.player.update();
  }
}
