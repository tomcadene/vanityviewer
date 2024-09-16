const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const USE_SUN_LIGHT = true; // Set this to true to add a sun light to the scene
const ADD_PLANE_TO_THE_SCENE = true; // Set this to true to add a plane to the scene

// SHADOW TYPES
const SHADOW_TYPE = 'PCFSoftShadowMap';
// 'BasicShadowMap', gives unfiltered shadow maps - fastest, but lowest quality.
// 'PCFShadowMap', filters shadow maps using the Percentage-Closer Filtering (PCF) algorithm (default).
// 'PCFSoftShadowMap' (DEFAULT), filters shadow maps using the Percentage-Closer Filtering (PCF) algorithm with better soft shadows especially when using low-resolution shadow maps.
// 'VSMShadowMap', filters shadow maps using the Variance Shadow Map (VSM) algorithm. When using VSMShadowMap all shadow receivers will also cast shadows.
// Source: https://threejs.org/docs/#api/en/constants/Renderer

const SHADOW_MAP_SIZE = 1024; // Increase shadow map size to 2048 for better quality

const DISABLE_COLOR_CORRECTION = false; // Set this to true to disable toneMapping

const ENABLE_INTERFACE = true; // Set this to true to enable the user interface

// DEBUGGING TOOLS
const ADD_DEBUGGING_TOOLS = false; // Set this to true to add a debugging tools to the scene
// Notes
// If set to true, a yellow arrow helper will be added to visualize the light direction.
// If set to true, a performance monitor will be added to the scene.
    // FPS Frames rendered in the last second. The higher the number the better.
    // MS Milliseconds needed to render a frame. The lower the number the better.
    // MB MBytes of allocated memory.
    // Source: https://github.com/mrdoob/stats.js

export {
    USE_BACKGROUND_TEXTURE,
    USE_SUN_LIGHT,
    ADD_PLANE_TO_THE_SCENE,
    SHADOW_TYPE,
    SHADOW_MAP_SIZE,
    DISABLE_COLOR_CORRECTION,
    ADD_DEBUGGING_TOOLS
};

