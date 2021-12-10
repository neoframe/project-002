import { Animations, GameObjects } from 'phaser';

export default class Weapon extends GameObjects.Sprite {
  static DPS = 30;

  static FRAMES = {
    RIGHT: [864, 869],
    TOP: [870, 875],
    LEFT: [876, 881],
    BOTTOM: [882, 887],
  }

  static OFFSETS = {
    RIGHT: [8, -13],
    TOP: [0, -13],
    LEFT: [-8, -13],
    BOTTOM: [0, -3],
  }

  constructor (player, texture = 'player') {
    super(player.scene, player.x, player.y, texture, Weapon.FRAMES.BOTTOM[0]);
    this.texture = texture;
    this.player = player;
  }

  create () {
    this.setVisible(false);
    this.setDepth(this.player.depth - 1);

    ['right', 'top', 'left', 'bottom'].forEach(dir => {
      const frames = Weapon.FRAMES[dir.toUpperCase()];

      this.scene.anims.create({
        key: `weapon-${dir}`,
        frames: this.scene.anims.generateFrameNumbers(this.texture, {
          start: frames[0],
          end: frames[1],
        }),
        frameRate: 15,
        repeat: 0,
      });
    });

    this.scene.add.existing(this);
  }

  update () {
    const [x, y] = Weapon.OFFSETS[this.player.direction.toUpperCase()] || [];
    this.setPosition(
      this.player.x + (x || 0),
      this.player.y + (y || 0)
    );
  }

  attack (dir) {
    this.setVisible(true);
    this.anims.play(`weapon-${dir}`, true);

    this.once(Animations.Events.ANIMATION_COMPLETE, () => {
      this.setVisible(false);
      this.setFrame(Weapon.FRAMES[dir.toUpperCase()][0]);
    });
  }
}
