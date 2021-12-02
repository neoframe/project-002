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

    if (!scene.sys.settings.isBooted) {
      scene.sys.events.once('boot', this.boot.bind(this));
    }
  }

  boot () {
    this.objects = this.scene.add.group({ runChildUpdate: true });
  }

  add (texture, x, y, width, height) {
    const bg = new ExpandableBackground(
      this.scene, texture, x, y, width, height);
    this.objects.add(bg, true);

    return bg;
  }
}
