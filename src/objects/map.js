import { Events } from 'phaser';

import PNJ from './pnj';
import Enemy from './enemy';
import * as tilesets from '../assets/images';
import * as maps from '../assets/maps';
import * as pnjs from '../assets/pnjs';
import * as enemies from '../assets/enemies';

export default class Map {
  events = new Events.EventEmitter();
  tilesets = [];
  layers = [];
  obstacles = [];
  actions = [];
  startPositions = [];
  playerDepth = 0;

  constructor (scene, player) {
    this.scene = scene;
    this.player = player;
    this.player.map = this;

    Object.entries(tilesets).forEach(([k, v]) => {
      scene.load.image(`tileset-${k}`, v);
    });

    Object.values(maps).forEach((v, i) => {
      scene.load.tilemapTiledJSON(`map-${i + 1}`, v);
    });

    Object.entries(pnjs).forEach(([k, v]) => {
      scene.load.spritesheet(`pnj-${k}`, v.charset.image, {
        frameWidth: v.charset.frameWidth,
        frameHeight: v.charset.frameHeight,
      });
    });

    Object.entries(enemies).forEach(([k, v]) => {
      scene.load.spritesheet(`enemy-${k}`, v.charset.image, {
        frameWidth: v.charset.frameWidth,
        frameHeight: v.charset.frameHeight,
      });
    });
  }

  create () {
    this.pnjs = this.scene.add.group();
    this.enemies = this.scene.add.group({ runChildUpdate: true });
  }

  reset () {
    [...this.obstacles, ...this.actions]
      .forEach(o => o && this.scene.matter.world.remove(o));
    this.pnjs?.clear(true, true);
    this.enemies?.clear(true, true);
    this.tilemap?.destroy();
    this.tilesets = [];
    this.layers = [];
    this.obstacles = [];
    this.actions = [];
    this.startPositions = [];
  }

  init (mapId, options = {}) {
    this.reset();
    this.id = mapId;
    this.tilemap = this.scene.add.tilemap(`map-${mapId}`, 0, 0);

    // Init tilesets
    this.tilemap.tilesets.forEach(tileset => {
      this.tilesets.push(this.tilemap
        .addTilesetImage(tileset.name, `tileset-${tileset.name}`));
    });

    // Init layers
    this.tilemap.layers.forEach(l => {
      const layer = this.tilemap
        .createLayer(l.name, this.tilesets, 0, 0)
        .setDepth(this.getProperty(l.properties, 'depth'));

      this.layers.push(layer);
    });

    this.tilemap.objects?.forEach(layer => {
      layer.objects.forEach(obj => {
        this.initCollisions(layer, obj, options);
        this.initActions(layer, obj, options);
        this.initPlayerProps(layer, obj, options);
        this.initPnjs(layer, obj, options);
        this.initEnemies(layer, obj, options);
      });
    });

    this.scene.matter.world.setBounds(0, 0, this.getWidth(), this.getHeight());

    this.events.emit('startPosition',
      this.startPositions.find(s => s.source === options.from) ||
      this.startPositions.find(s => s.source === 'default') ||
      { x: this.getWidth() / 2, y: this.getHeight() / 2 });
  }

  initCollisions (layer, obj) {
    if (
      this.getProperty(layer.properties, 'collides') === true ||
      this.getProperty(obj.properties, 'collides') === true
    ) {
      this.obstacles.push(this.createObject(obj, {
        render: { lineColor: 0xFF0000 },
      }));
    }
  }

  initActions (layer, obj) {
    if (this.getProperty(obj.properties, 'action') === true) {
      let props = {};

      if (this.getProperty(obj.properties, 'goTo')) {
        props = {
          isSensor: true,
          onCollideCallback: () => {
            this.events.emit('goTo', this.getProperty(obj.properties, 'goTo'));
          },
        };
      }

      this.actions.push(this.createObject(obj, props));
    }
  }

  initPlayerProps (layer, obj, options) {
    if (this.getProperty(obj.properties, 'player') === true) {
      this.playerDepth = this.getProperty(layer.properties, 'depth');
    }

    const startPosition = this.getProperty(obj.properties, 'start');

    if (startPosition && startPosition === options.from) {
      this.startPositions.push({ source: startPosition, x: obj.x, y: obj.y });
    } else if (startPosition === true) {
      this.startPositions.push({ source: 'default', x: obj.x, y: obj.y });
    }
  }

  initPnjs (layer, obj) {
    const depth = this.getProperty(layer.properties, 'depth');

    if (this.getProperty(obj.properties, 'pnj')) {
      const pnjId = this.getProperty(obj.properties, 'pnj');

      const pnj = new PNJ(this.scene, this.player, pnjId, obj.x, obj.y);
      pnj.create().setDepth(depth);

      this.scene.minimap.ignore(pnj);
      this.pnjs.add(pnj);
    }
  }

  initEnemies (layer, obj) {
    const depth = this.getProperty(layer.properties, 'depth');

    if (this.getProperty(obj.properties, 'enemy')) {
      const enemyId = this.getProperty(obj.properties, 'enemy');

      const enemy = new Enemy(this.scene, this.player, enemyId, obj.x, obj.y);
      enemy.create().setDepth(depth);
      enemy.events.once('die', () => {
        this.enemies.killAndHide(enemy);
        enemy.destroy();
      });

      this.scene.minimap.ignore(enemy);
      this.enemies.add(enemy);
    }
  }

  createObject (obj, props = {}) {
    const center = this.getCenter(obj);

    if (obj.rectangle) {
      return this.scene.matter.add
        .rectangle(obj.x + center.x, obj.y + center.y, obj.width, obj.height, {
          ignoreGravity: true,
          isStatic: true,
          ...props,
        });
    } else if (obj.polygon) {
      return this.scene.matter.add
        .fromVertices(obj.x + center.x, obj.y + center.y, obj.polygon, {
          ignoreGravity: true,
          isStatic: true,
          ...props,
        });
    }
  }

  getCenter (obj) {
    if (obj.rectangle) {
      return { x: obj.width / 2, y: obj.height / 2 };
    } else if (obj.polygon) {
      const x = obj.polygon.map(p => p.x);
      const y = obj.polygon.map(p => p.y);

      return {
        x: (Math.min(...x) + Math.max(...x)) / 2,
        y: (Math.min(...y) + Math.max(...y)) / 2,
      };
    }
  }

  getProperty (props = [], name) {
    return (Array.isArray(props) ? props : [])
      .find(p => p.name === name)?.value;
  }

  hasProperty (props = [], name) {
    return (Array.isArray(props) ? props : []).some(p => p.name === name);
  }

  getPlayerDepth () {
    return this.playerDepth;
  }

  getWidth () {
    return this.tilemap.widthInPixels;
  }

  getHeight () {
    return this.tilemap.heightInPixels;
  }

  hasMap (mapId) {
    return !!maps[`map${mapId}`];
  }
}
