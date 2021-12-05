import { Scene } from 'phaser';

import loginForm from '../assets/forms/login.html';

export default class LoginScene extends Scene {
  constructor () {
    super('LoginScene');
  }

  preload () {
    this.load.html('login-form', loginForm);
  }

  create () {
    const form = this.add.dom(400, 300).createFromCache('login-form', 'div');
  }
}
