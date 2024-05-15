const vvElement = document.querySelector('.vv');

const MODEL_PATH = '/models/brass_goblets_2k.gltf/brass_goblets_2k.gltf'; // Path to the model file
const HDRI_PATH = '/hdris/safari_sunset_2k.hdr'; // Path to the model file

const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const USE_SUN_LIGHT = true; // Set this to true to add a plane to the scene
const ADD_PLANE_TO_THE_SCENE = false; // Set this to true to add a plane to the scene

export { vvElement, MODEL_PATH, HDRI_PATH, USE_BACKGROUND_TEXTURE, USE_SUN_LIGHT, ADD_PLANE_TO_THE_SCENE };
