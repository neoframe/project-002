import zombie from '../images/charset-zombie.png';

export default {
  maxLife: 100,
  dps: 20,
  charset: {
    image: zombie,
    frameWidth: 64,
    frameHeight: 96,
    bodyWidth: 31,
    bodyHeight: 38,
    frames: {
      idle: {
        frames: [0, 2],
        frameRate: 5,
      },
      walk: [0, 4],
    },
  },
};
