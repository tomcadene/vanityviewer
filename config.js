const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const USE_SUN_LIGHT = true; // Set this to true to add a sun light to the scene
const ADD_PLANE_TO_THE_SCENE = false; // Set this to true to add a plane to the scene

// PERFORMANCE_MONITOR
const ADD_PERFORMANCE_MONITOR = false; // Set this to true to add a performance monitor to the scene
// Notes
// FPS Frames rendered in the last second. The higher the number the better.
// MS Milliseconds needed to render a frame. The lower the number the better.
// MB MBytes of allocated memory.
// Source: https://github.com/mrdoob/stats.js

// DEBUGGING_TOOLS
const ADD_DEBUGGING_TOOLS = true; // Set this to true to add a debugging tools to the scene
// Notes
// If set to true, a yellow arrow helper will be added to visualize the light direction.

export { USE_BACKGROUND_TEXTURE, USE_SUN_LIGHT, ADD_PLANE_TO_THE_SCENE, ADD_PERFORMANCE_MONITOR, ADD_DEBUGGING_TOOLS };
