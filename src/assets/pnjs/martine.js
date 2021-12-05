import martine from '../images/charset-martine.png';

export default {
  name: 'Martine',
  charset: {
    image: martine,
    frameWidth: 32,
    frameHeight: 64,
    bodyWidth: 31,
    bodyHeight: 38,
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
    id: 'start',
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
    options: ['Ok thanks'],
  }, {
    id: 'not-so-good',
    text: 'Oh no! What happened?',
    options: [{
      text: 'I lost my wallet',
      to: ({ player }) =>
        player.hasFlag('martine-gave-money') ? 'gave-money' : 'lost-wallet',
    }, {
      text: 'I\'m fine actually',
      to: 'fine',
    }],
  }, {
    id: 'default',
    text: 'I think I\'m gonna go home!',
    options: ['Have fun!'],
  }, {
    id: 'lost-wallet',
    text: 'Here, take this, I don\'t need it anyway',
    condition: ({ player }) => !player.hasFlag('martine-gave-money'),
    options: [{
      text: 'Thanks',
      action: ({ player }) => {
        player.addMoney(100);
        player.addFlag('martine-gave-money');
      },
    }],
  }, {
    id: 'gave-money',
    text: 'I hope the money I gave you was helpful!',
    options: ['Thanks'],
  }],
};
