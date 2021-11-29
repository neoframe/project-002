import { Game, Scale, AUTO } from 'phaser';
import RexUI from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import RexAnchor from 'phaser3-rex-plugins/plugins/anchor-plugin';

import { DEBUG } from './utils/settings';
import MainScene from './scenes/main';

import './index.css';

const _ = new Game({
  type: AUTO,
  backgroundColor: 0x000000,
  physics: {
    default: 'matter',
    matter: {
      gravity: { x: 0, y: 0 },
      ...(DEBUG ? {
        debug: {
          showBody: true,
          showStaticBody: true,
        },
      } : {}),
    },
    arcade: {
      gravity: { x: 0, y: 0 },
      ...(DEBUG ? {
        debug: true,
        debugShowBody: true,
      } : {}),
    },
  },
  fps: { target: 60 },
  scale: {
    mode: Scale.RESIZE,
    autoCenter: Scale.CENTER_BOTH,
  },
  pixelArt: true,
  scene: [MainScene],
  plugins: {
    scene: [
      { key: 'rexUI', plugin: RexUI, mapping: 'rexUI' },
      { key: 'rexAnchor', plugin: RexAnchor, mapping: 'rexAnchor' },
    ],
  },
});
