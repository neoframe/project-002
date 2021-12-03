import ExpandableBackground from '../objects/expandable-background';

export default class ExpandableBackgroundPlugin {
  static register (manager) {
    manager.register(
      'ExpandableBackgroundPlugin',
      ExpandableBackgroundPlugin,
      'expandableBackgrounds'
    );
  }

  constructor (scene) {
    this.scene = scene;
    this.sys = scene.sys;
  }

  add (texture, x, y, width, height) {
    const bg = new ExpandableBackground(
      this.scene, texture, x, y, width, height);
    this.scene.add.existing(bg);

    return bg;
  }
}
