import { GameObjects } from 'phaser';

export default class ExpandableBackground extends GameObjects.Zone {
  static FRAMES = [
    'top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left',
    'bottom', 'bottom-right',
  ];

  constructor (scene, texture, x, y, width, height) {
    super(scene, x, y, width, height);

    this.previousRender = { x, y, width, height };

    this.texture = scene.textures.get(texture);
    this.frameDimensions = {
      width: this.texture.frames[0].width,
      height: this.texture.frames[0].height,
    };

    this.tiles = [
      this.createCorner('top-left'),
      this.createSide('top'),
      this.createCorner('top-right'),
      this.createSide('left'),
      this.createSide('center'),
      this.createSide('right'),
      this.createCorner('bottom-left'),
      this.createSide('bottom'),
      this.createCorner('bottom-right'),
    ];
  }

  getTileX (side) {
    switch (side) {
      case 'top':
      case 'center':
      case 'bottom':
        return this.x + this.frameDimensions.width;
      case 'top-right':
      case 'right':
      case 'bottom-right':
        return this.x + this.width - this.frameDimensions.width;
      default:
        return this.x;
    }
  }

  getTileY (side) {
    switch (side) {
      case 'left':
      case 'center':
      case 'right':
        return this.y + this.frameDimensions.height;
      case 'bottom-left':
      case 'bottom':
      case 'bottom-right':
        return this.y + this.height - this.frameDimensions.height;
      default:
        return this.y;
    }
  }

  getTileWidth (side) {
    switch (side) {
      case 'top':
      case 'center':
      case 'bottom':
        return this.width - this.frameDimensions.width * 2;
      default:
        return this.frameDimensions.width;
    }
  }

  getTileHeight (side) {
    switch (side) {
      case 'left':
      case 'center':
      case 'right':
        return this.height - this.frameDimensions.height * 2;
      default:
        return this.frameDimensions.height;
    }
  }

  getTileDimensions (side) {
    return {
      x: this.getTileX(side),
      y: this.getTileY(side),
      width: this.getTileWidth(side),
      height: this.getTileHeight(side),
    };
  }

  getFrame (side) {
    return ExpandableBackground.FRAMES.findIndex(f => f === side) || 0;
  }

  createCorner (side) {
    return this.scene.add
      .image(this.getTileX(side), this.getTileY(side), this.texture,
        this.getFrame(side))
      .setOrigin(0);
  }

  createSide (side) {
    const dims = this.getTileDimensions(side);

    return this.scene.add
      .tileSprite(dims.x, dims.y, dims.width, dims.height, this.texture,
        this.getFrame(side))
      .setOrigin(0);
  }

  update (...args) {
    if (
      this.previousRender.x !== this.x ||
      this.previousRender.y !== this.y ||
      this.previousRender.width !== this.width ||
      this.previousRender.height !== this.height
    ) {
      this.tiles.forEach((tile, i) => {
        const dims = this.getTileDimensions(ExpandableBackground.FRAMES[i]);

        tile.setPosition(dims.x, dims.y);
        tile.setSize(dims.width, dims.height);
      });
    }

    this.previousRender = {
      x: this.x, y: this.y, width: this.width, height: this.height,
    };
    super.update(...args);
  }
}