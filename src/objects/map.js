
import { GameObjects, Geom } from 'phaser';
import * as tilesets from '../assets/images';
import * as maps from '../assets/maps';

export default class Map {
  static TILESETS = ['farm', 'interiorBasic'];
  static MAPS = Array.from({ length: 1 }).map((_, i) => i + 1);

  tilesets = [];
  layers = [];
  obstacles = [];
  playerDepth = 0;

  constructor (scene, player) {
    this.scene = scene;
    this.player = player;

    Map.TILESETS.forEach(async tileset => {
      scene.load.image(
        `tileset-${tileset}`,
        tilesets[tileset]
      );
    });

    Map.MAPS.forEach(i => {
      scene.load.tilemapTiledJSON(
        `map-${i}`,
        maps[`map${i}`]
      );
    });
  }

  create () {
    this.init(1);
  }

  init (mapId) {
    this.tilemap?.destroy();
    this.tilesets = [];
    this.layers = [];
    this.obstacles = [];

    this.tilemap = this.scene.add.tilemap(`map-${mapId}`, 0, 0);
    console.log(this.tilemap);

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

    this.tilemap.objects.forEach(l => {
      if (this.hasProperty(l.properties, 'collides', true)) {
        console.log(l.objects);
        l.objects.forEach(o => {
          const polygon = new GameObjects
            .Polygon(this.scene, o.x, o.y, o.polygon, 0x00ff00);

          this.scene.add.existing(polygon);
          this.scene.physics.add.existing(polygon);
          // polygon.setVisible(false);
          polygon.body.allowGravity = false;
          polygon.body.immovable = true;
          this.obstacles.push(polygon);

          console.log(polygon);
        });
      }

      if (this.hasProperty(l.properties, 'player', true)) {
        this.playerDepth = this.getProperty(l.properties, 'depth');
        this.playerStartPosition = l.objects.find(o => this.hasProperty(o.properties, 'player', true));
      }
    });
    
    console.log(this.playerStartPosition);

    this.scene.physics.add.collider(this.player, this.obstacles);
  }

  getProperty (props, name) {
    return props?.find(p => p.name === name)?.value;
  }

  hasProperty (props, name, val) {
    return props?.some(p => p.name === name && p.value === val);
  }

  getPlayerDepth () {
    return this.playerDepth;
  }
}
