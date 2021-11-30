import martine from '../images/charset-martine.png';

export default {
  name: 'Martine',
  charset: {
    image: martine,
    frameWidth: 32,
    frameHeight: 64,
    frames: {
      idle: {
        right: [56, 61],
        top: [62, 67],
        left: [68, 73],
        bottom: [74, 79],
      },
    },
  },
  dialogs: [{
    id: 'default',
    text: 'Hey how are you?',
    options: [{
      text: 'Fine',
      to: 'fine',
    }, {
      text: 'Not so good',
      to: 'not-so-good',
    }],
  }, {
    id: 'fine',
    text: 'Alright cool! I\'m fine too!',
  }, {
    id: 'not-so-good',
    text: 'Oh no! What happened?',
    options: [{
      text: 'I lost my wallet',
      to: 'lost-wallet',
    }, {
      text: 'I\'m fine actually',
      to: 'fine',
    }],
  }],
};
