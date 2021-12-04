import { Cameras, Scene } from 'phaser';

import { ZOOM } from '../utils/settings';
import Player from '../objects/player';
import Map from '../objects/map';
import minimalPixel from '../assets/fonts/minimalpixel.png';
import minimalPixelXML from '../assets/fonts/minimalpixel.xml';

export default class MainScene extends Scene {
  constructor () {
    super({ key: 'MainScene' });
  }

  preload () {
    this.player = new Player(this);
    this.map = new Map(this, this.player);

    this.load.bitmapFont('minimal-pixel', minimalPixel, minimalPixelXML);
  }

  create () {
    this.player.create();

    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setZoom(ZOOM);

    this.map.create();

    this.map.events.once('startPosition', ({ x, y }) => {
      this.player.setPosition(x, y);
    });

    this.player.canMove = false;
    this.map.init(1);

    this.scene.launch('HUDScene');
    this.onMapReady();
  }

  update () {
    this.player.update();
  }

  goTo (mapId) {
    this.player.canMove = false;
    this.map.events.once('startPosition', ({ x, y }) => {
      this.player.setPosition(x, y);
    });

    this.cameras.main.fadeOut(500);
    this.cameras.main.once(Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
      this.map.init(mapId, { from: this.map.id });
      this.onMapReady();
    });
  }

  onMapReady () {
    this.player.setDepth(this.map.getPlayerDepth());
    this.cameras.main
      .setBounds(0, 0, this.map.getWidth(), this.map.getHeight());

    this.map.events.once('goTo', mapId => {
      if (this.map.hasMap(mapId)) {
        this.goTo(mapId);
      }
    });

    this.cameras.main.fadeIn(500);
    this.cameras.main.once(Cameras.Scene2D.Events.FADE_IN_COMPLETE, () => {
      this.player.canMove = true;
    });
  }

  getHUD () {
    return this.scene.get('HUDScene');
  }

  getPlayer () {
    return this.player;
  }
}
