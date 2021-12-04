import { ZOOM } from '../../utils/settings';
import playerUiBackground from '../../assets/images/player-ui.png';
import playerLife from '../../assets/images/player-life.png';
import playerMana from '../../assets/images/player-mana.png';

export default class PlayerUI {
  constructor (scene) {
    this.scene = scene;
  }

  preload () {
    this.scene.load.image('player-ui', playerUiBackground);
    this.scene.load.image('player-life', playerLife);
    this.scene.load.image('player-mana', playerMana);
  }

  create () {
    this.scene.add
      .image(20, 20, 'player-ui')
      .setScale(ZOOM * 2)
      .setOrigin(0);

    this.money = this.scene.add
      .bitmapText(155, 81, 'minimal-pixel', this.getMoney(), 40, 'left');

    this.life = this.scene.add
      .image(124, 28, 'player-life')
      .setScale(ZOOM * 2)
      .setOrigin(0);

    this.lifeMask = this.createMask(this.life);

    this.mana = this.scene.add
      .image(124, 52, 'player-mana')
      .setScale(ZOOM * 2)
      .setOrigin(0);

    this.manaMask = this.createMask(this.mana);

    // const subject = this.mana;
    // this.scene.input.keyboard.on('keyup-RIGHT', () => {
    //   subject.x += 1;
    //   console.log(subject.x);
    // });
    // this.scene.input.keyboard.on('keyup-LEFT', () => {
    //   subject.x -= 1;
    //   console.log(subject.x);
    // });
    // this.scene.input.keyboard.on('keyup-UP', () => {
    //   subject.y -= 1;
    //   console.log(subject.y);
    // });
    // this.scene.input.keyboard.on('keyup-DOWN', () => {
    //   subject.y += 1;
    //   console.log(subject.y);
    // });
  }

  update () {
    this.money.setText(this.getMoney());
    this.lifeMask.x = -this.lifeMask.width +
      this.lifeMask.width * (this.getLife() / this.getMaxLife());
    this.manaMask.x = -this.manaMask.width +
      this.manaMask.width * (this.getMana() / this.getMaxMana());
  }

  createMask (gameObject) {
    const mask = this.scene.make.graphics()
      .beginPath()
      .fillRect(
        gameObject.x, gameObject.y,
        gameObject.width * gameObject.scale,
        gameObject.height * gameObject.scale
      );

    mask.width = gameObject.width * gameObject.scale;
    mask.height = gameObject.height * gameObject.scale;

    gameObject.setMask(mask.createGeometryMask());

    return mask;
  }

  getPlayer () {
    return this.scene.scene.get('MainScene').getPlayer();
  }

  getMoney () {
    return this.getPlayer()?.getMoney() ?? 0;
  }

  getLife () {
    return this.getPlayer()?.getLife() ?? 100;
  }

  getMaxLife () {
    return this.getPlayer()?.getMaxLife() ?? 100;
  }

  getMana () {
    return this.getPlayer()?.getMana() ?? 100;
  }

  getMaxMana () {
    return this.getPlayer()?.getMaxMana() ?? 100;
  }
}
