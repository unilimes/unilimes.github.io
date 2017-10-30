"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FACTOR = 11;
exports.SOFAWIDTH = 3.27 * exports.FACTOR;
exports.SOFAHEIGHT = 1.45 * exports.FACTOR;
exports.ZOOMFACTOR = 1.2;
exports.INIT_CAMERA_POS = [0, 45, 90];
exports.PERSPECTIVE_CAMERA_CONFIG = {
    FOV: 60,
    aspectRatio: 16 / 9,
    clipNear: 0.125,
    clipFar: 2048
};
exports.HIGHLIGHT_COLOR = 0x111111;
exports.HIGHLIGHT_COLOR2 = 0xec0044;
exports.WHITE = 0xcacdd2;
exports.BLACK = 0x222328;
exports.BROWN = 0xa69d94;
exports.PINK = 0xc4a8b6;
exports.BLUE_ = 0x848dac;
exports.CHALK = 0xddd7c9;
exports.LIGHTGRAY = 0xa1a1a1;
exports.BEIGE = 0x9b8f86;
exports.BLUE = 0x1d274b;
exports.CHARCOALBLACK = 0x141319;
exports.CHARCOAL = 0x514d4a;
exports.NAVY = 0x343b55;
exports.LIGHTGRAY_ = 0x848484;
exports.BEIGE_ = 0x897d6d;
exports.TEXTURE_WRAPS = 2;
exports.TEXTURE_WRAPT = 2;
exports.TEXTURE_BUMP = 0.1;
exports.NODESIZE = 0.1 * exports.FACTOR;
/* renderer color */
exports.RENDERER_COLOR = 0xFFFFFF;
exports.SKYBOX_COLOR = 0xfafafa;
// export const SKYBOX_COLOR = 0x161616
/* floor */
exports.RENDER_MIRROR = true;
exports.FLOOR_COLOR = 0xe2e2e2;
exports.MIRROR_COLOR = 0xa0a0a0;
// export const MIRROR_COLOR = 0x7D7D7D
/* light */
exports.AMBIENT_INTENSITY = 0.3;
exports.SPOT_HEIGHT = 64;
exports.RENDER_SPOT = false;
exports.SPOT_COLOR = 0xffffff;
exports.SPOT_INTENSITY = 0.5;
exports.SPOT_DISTANCE = 300;
exports.SPOT_ANGLE = 3.05;
exports.SPOT_PENUMBRA = 0.3;
exports.SPOT_DECAY = 1;
/* root folder for loading assets */
exports.ROOT = 'https://xgui3783.github.io/';
// export const ROOT = 'http://localhost/kopa2/'
exports.PRICE = {
    SOFA: 330,
    ARMREST: 220,
    BACKREST: 110,
    CUSHION: 30
};
exports.SCALE = 1000 / 37 / 11 * exports.FACTOR;
//# sourceMappingURL=constants.js.map