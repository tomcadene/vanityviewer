import * as THREE from '/three.js-master/build/three.module.js';
import { OrbitControls } from '/three.js-master/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/three.js-master/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from '/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { BokehPass } from '/three.js-master/examples/jsm/postprocessing/BokehPass.js';
import { EffectComposer } from '/three.js-master/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from '/three.js-master/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from '/three.js-master/examples/jsm/postprocessing/ShaderPass.js';
import { Pass } from '/three.js-master/examples/jsm/postprocessing/Pass.js';
import { MaskPass } from '/three.js-master/examples/jsm/postprocessing/MaskPass.js';
import { BokehShader } from '/three.js-master/examples/jsm/postprocessing/shaders/BokehShader.js';
import { CopyShader } from '/three.js-master/examples/jsm/postprocessing/shaders/CopyShader.js';

// Conditional parameters
const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const ADD_PLANE_TO_THE_SCENE = false; // Set this to true to add a plane to the scene

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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;

vvElement.appendChild(renderer.domElement); // Append renderer to the .vv div instead of body

// Resize handler to ensure the scene adjusts with the viewport/window size
function onWindowResize() {
  // Update camera aspect ratio and renderer size when window resizes
  const width = vvElement.clientWidth;
  const height = vvElement.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
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
// Add a light source
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 5);
light.castShadow = true; // This light will cast shadows
scene.add(light);

// Add an ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);

// Loading HDR Environment for Reflections
const rgbeLoader = new RGBELoader();
rgbeLoader.load('safari_sunset_2k.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  if (USE_BACKGROUND_TEXTURE) {
    scene.background = texture;
  }
  scene.environment = texture;
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Button functionality to change the opacity
document.getElementById('opacityButton').addEventListener('click', function() {
  cube.material.opacity = cube.material.opacity === 1 ? 0.5 : 1; // Toggle between 0.5 and 0.85
  console.log('Opacity changed to: ' + cube.material.opacity); // Log the change for verification
});