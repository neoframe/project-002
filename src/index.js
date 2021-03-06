import { Game, Scale, AUTO } from 'phaser';
import RexUI from 'phaser3-rex-plugins/templates/ui/ui-plugin';
import OutlinePipelinePlugin
  from 'phaser3-rex-plugins/plugins/outlinepipeline-plugin.js';
import OutlinePostFx from 'phaser3-rex-plugins/plugins/outlinepipeline.js';

import ExpandableBackgroundPlugin from './plugins/expandable-background';
import { DEBUG } from './utils/settings';
import MainScene from './scenes/main';
import HUDScene from './scenes/hud';
import WebSocketPlugin from './plugins/websocket';

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
  antialias: false,
  antialiasGL: false,
  pixelArt: true,
  scene: [MainScene, HUDScene],
  plugins: {
    scene: [
      { key: 'rexUI', plugin: RexUI, mapping: 'rexUI' },
      { key: 'rexOutlinePipeline', plugin: OutlinePipelinePlugin,
        mapping: 'rexOutlinePipeline', start: true },
      { key: 'expandableBackgrounds', plugin: ExpandableBackgroundPlugin,
        mapping: 'expandableBackgrounds' },
      { key: 'webSocketPlugin', plugin: WebSocketPlugin, mapping: 'webSocket' },
    ],
  },
  pipeline: [OutlinePostFx],
});
