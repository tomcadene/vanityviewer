import * as THREE from '/three.js-master/build/three.module.js';
import { OrbitControls } from '/three.js-master/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/three.js-master/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from '/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { BokehPass } from '/three.js-master/examples/jsm/postprocessing/BokehPass.js';
import { EffectComposer } from '/three.js-master/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/three.js-master/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/three.js-master/examples/jsm/postprocessing/ShaderPass.js';
import { Pass } from '/three.js-master/examples/jsm/postprocessing/Pass.js';
import { SMAAPass } from '/three.js-master/examples/jsm/postprocessing/SMAAPass.js';
import { MaskPass } from '/three.js-master/examples/jsm/postprocessing/MaskPass.js';
import { BokehShader } from '/three.js-master/examples/jsm/shaders/BokehShader.js';
import { CopyShader } from '/three.js-master/examples/jsm/shaders/CopyShader.js';
import { GammaCorrectionShader } from '/three.js-master/examples/jsm/shaders/GammaCorrectionShader.js';

// Conditional parameters
const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const ADD_PLANE_TO_THE_SCENE = true; // Set this to true to add a plane to the scene

// Reference to the .vv div
const vvElement = document.querySelector('.vv');

// Calculate aspect ratio of the .vv div
const aspectRatio = vvElement.clientWidth / vvElement.clientHeight;

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.set(2, 2, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(vvElement.clientWidth, vvElement.clientHeight); // Set size to match .vv div
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;
renderer.autoClear = true;
console.log('renderer.toneMappingExposure:', renderer.toneMappingExposure);

vvElement.appendChild(renderer.domElement); // Append renderer to the .vv div instead of body

// Resize handler to ensure the scene adjusts with the viewport/window size
function onWindowResize() {
  // Update camera aspect ratio and renderer size when window resizes
  const width = vvElement.clientWidth;
  const height = vvElement.clientHeight;
  camera.aspect = width / height;
  camera.near = 0.1;
camera.far = 100;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  console.log('Window resized and renderer updated');
}

// Listen for window resize events
window.addEventListener('resize', onWindowResize);

// Add orbit controls to allow camera movement
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Add a green cube to the scene
const geometry = new THREE.BoxGeometry();
// Adjust the material properties for the cube
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00, // Green color
  metalness: 0,    // Make it fully metallic
  roughness: 0,   // Adjust roughness to control how shiny the surface is
  transparent: true, // Enable transparency
  opacity: 1      // Adjust opacity here, 0 is fully transparent, 1 is fully opaque
});

const cube = new THREE.Mesh(geometry, material);
cube.castShadow = true; // The cube will cast shadows
cube.receiveShadow = true;
scene.add(cube);

const cube2 = new THREE.Mesh(geometry, material);
cube2.position.z = -10; // Further away
scene.add(cube2);

// Ground Plane
const planeGeometry = new THREE.PlaneGeometry(50, 50);
const planeMaterial = new THREE.MeshStandardMaterial({
  color: 0x808080, // Neutral gray
  roughness: 1,    // Non-reflective surface
  metalness: 0,    // Non-metallic surface
  transparent: true, // Enable transparency
  opacity: 0.85      // Adjust opacity here, 0 is fully transparent, 1 is fully opaque
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = - Math.PI / 2; // Rotate to lay flat
plane.position.y = -1; // Position slightly below the cube
plane.receiveShadow = true; // Ensure it can receive shadows
if (ADD_PLANE_TO_THE_SCENE) {
  scene.add(plane); // Add plane to the scene
}

// Create a GridHelper
const size = 10; // Size of the grid
const divisions = 10; // Number of divisions in the grid
const gridHelper = new THREE.GridHelper(size, divisions, 0xffffff, 0x00ff00); // White central lines, green grid lines
// Changing the position of the grid
gridHelper.position.set(0, -1, 0); // Move the grid to position (5, 0, 5)
scene.add(gridHelper);


// Add a light source
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
light.castShadow = true; // This light will cast shadows
scene.add(light);

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);
console.log('Ambient light added to the scene');
// Check and adjust ambient light intensity
console.log('Ambient light intensity before composer:', ambientLight.intensity);
ambientLight.intensity = 1; // Adjust as needed
console.log('Ambient light intensity after composer adjustment:', ambientLight.intensity);


// Loading HDR Environment for Reflections
const rgbeLoader = new RGBELoader();
rgbeLoader.load('safari_sunset_4k.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  if (USE_BACKGROUND_TEXTURE) {
    scene.background = texture;
  }
  scene.environment = texture;
});

// Effect Composer
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
renderPass.clear = true;  // This should be true by default

composer.addPass(renderPass)

const toggleRenderingButton = document.getElementById('dofButton');

// A flag to track the current rendering mode
let useComposer = false;

toggleRenderingButton.addEventListener('click', function () {
    useComposer = !useComposer;
    if(useComposer){
        console.log('Switched to composer rendering');
    } else {
        console.log('Switched to standard rendering');
    }
});

// Calculate the Euclidean distance between the camera and the cube at the origin
const distanceToCube = camera.position.length(); // Since the cube is at the origin, the length of the camera position vector is the distance

const bokehPass = new BokehPass(scene, camera, {
  focus: distanceToCube,
  aperture: 0.0005,
  maxblur: 0.005,
  width: vvElement.clientWidth,
  height: vvElement.clientHeight
});
composer.addPass(bokehPass);
console.log('Distance to the closest cube:', distanceToCube);
// Add logging to see if the BokehPass is affecting the rendering
console.log('BokehPass added with focus:', bokehPass.uniforms.focus.value, 'and aperture:', bokehPass.uniforms.aperture.value);
console.log('Updated BokehPass settings: focus = ' + bokehPass.uniforms.focus.value + ', aperture = ' + bokehPass.uniforms.aperture.value);

// SMAA Antialiasing Pass
const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
composer.addPass(smaaPass);

// CopyShader as the last pass to ensure the rendered scene is copied onto the screen as is.
const copyPass = new ShaderPass(CopyShader);
composer.addPass(copyPass);

// Before the animation loop
composer.gammaOutput = renderer.gammaOutput;

// Make sure that the encoding of the final output matches the renderer
composer.outputEncoding = renderer.outputEncoding;

// Confirm that the EffectComposer uses the same tone mapping as the renderer
composer.toneMapping = renderer.toneMapping;

// Double-Check the Renderer's Clear Color
renderer.setClearColor(0x000000, 0); // Adjust the color and alpha as needed for your scene

const gammaCorrectionPass = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaCorrectionPass);

// Reset the Composer's Render Target
composer.renderTarget1.stencilBuffer = true;
composer.renderTarget2.stencilBuffer = true;

// Correctly Set the Composer's Render Target Encoding
composer.renderTarget1.texture.encoding = renderer.outputEncoding;
composer.renderTarget2.texture.encoding = renderer.outputEncoding;

// Check for Pass Settings
renderPass.clearAlpha = renderer.getClearAlpha();

// Revisit Ambient Light
ambientLight.intensity = 1; // Adjust as needed for your scene

// Logging for Debugging
console.log('Composer render target settings:', composer.renderTarget1.texture.encoding, composer.renderTarget2.texture.encoding);
console.log('Clear Alpha:', renderer.getClearAlpha());


// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  controls.update();
  // Here's where we decide which rendering method to use
  if (useComposer) {
    renderer.toneMappingExposure = 1.25; // Make sure this matches the initial setting
    composer.render(); // Use post-processing rendering
} else {
    renderer.render(scene, camera); // Use standard rendering
}
}

animate();

// Button functionality to change the opacity
document.getElementById('opacityButton').addEventListener('click', function() {
  cube.material.opacity = cube.material.opacity === 1 ? 0.5 : 1; // Toggle between 0.5 and 0.85
  console.log('Opacity changed to: ' + cube.material.opacity); // Log the change for verification
});