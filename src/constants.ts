/** @constant @type {number} @default */
export const FACTOR = 11;
/** @constant @type {number} @default */
export const SOFAWIDTH = 3.27 * FACTOR;
/** @constant @type {number} @default */
export const SOFAHEIGHT = 1.45 * FACTOR;
/** @constant @type {number} @default */
export const ZOOMFACTOR = 1.2;
/** @constant @type {number} @default */
export const INIT_CAMERA_POS = [0,45,90];
/** @constant @type {number} @default */
export const PERSPECTIVE_CAMERA_CONFIG = {
        FOV : 60,
        aspectRatio : 16/9,
        clipNear : 0.125,
        clipFar : 2048
    };

export const HIGHLIGHT_COLOR = 0x111111;
export const HIGHLIGHT_COLOR2 = 0xec0044;
/** @constant @type {string} @default */
export const WHITE = 0xcacdd2;
/** @constant @type {string} @default */
export const BLACK = 0x222328;
/** @constant @type {string} @default */
export const BROWN = 0xa69d94;
/** @constant @type {string} @default */
export const PINK = 0xc4a8b6;
/** @constant @type {string} @default */
export const BLUE_ = 0x848dac;
/** @constant @type {string} @default */
export const CHALK = 0xddd7c9;
/** @constant @type {string} @default */
export const LIGHTGRAY = 0xa1a1a1;
/** @constant @type {string} @default */
export const BEIGE = 0x9b8f86;
/** @constant @type {string} @default */
export const BLUE = 0x1d274b;
/** @constant @type {string} @default */
export const CHARCOALBLACK = 0x141319;
/** @constant @type {string} @default */
export const CHARCOAL = 0x514d4a;
/** @constant @type {string} @default */
export const NAVY = 0x343b55;
export const LIGHTGRAY_ = 0x848484;
export const BEIGE_ = 0x897d6d;

// Cusion color
/** @constant @type {string} @default */
export const BLACK_CUSION = 0x2d2d2d;
/** @constant @type {string} @default */
export const BLUE_CUSION = 0x1e2c55;
/** @constant @type {string} @default */
export const LIGHTGRAY_CUSION = 0x7b7b7b;
/** @constant @type {string} @default */
export const PURPLE_CUSION = 0x624971;
/** @constant @type {string} @default */
export const YELLOW_CUSION = 0xad9d4f;


export const TEXTURE_WRAPS = 2;
export const TEXTURE_WRAPT = 2;

export const TEXTURE_BUMP = 0.1;

export const NODESIZE = 0.1 * FACTOR;

/* renderer color */
export const RENDERER_COLOR = 0xFFFFFF;
export const SKYBOX_COLOR = 0xfafafa;
// export const SKYBOX_COLOR = 0x161616

/* floor */
/** @constant @type {bool} @default */
export const RENDER_MIRROR = true;
export const FLOOR_COLOR = 0xe2e2e2;
export const MIRROR_COLOR = 0xa0a0a0;
// export const MIRROR_COLOR = 0x7D7D7D

/* light */
export const AMBIENT_INTENSITY = 0.;
export const SPOT_HEIGHT = 64;

export const RENDER_SPOT = false;
/** @constant @type {string} @default */
export const SPOT_COLOR = 0xffffff;
export const SPOT_INTENSITY = 0.5;
export const SPOT_DISTANCE = 300;
export const SPOT_ANGLE = 3.05;
export const SPOT_PENUMBRA = 0.3;
export const SPOT_DECAY = 1;

/* root folder for loading assets */

export const ROOT = 'https://unilimes.github.io/';
// export const ROOT = 'http://localhost/kopa2/'
/** @constant @type {number} @default */
export const PRICE = {
    SOFA : 418,
    ARMREST : 286,
    BACKREST : 176,
    CUSHION : 55
};
/** @constant @type {number} @default */
export const SCALE = 1000 / 37 /11 * FACTOR;