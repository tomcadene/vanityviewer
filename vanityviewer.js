import * as THREE from '/three.js-master/build/three.module.js';
import { OrbitControls } from '/three.js-master/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/three.js-master/examples/jsm/loaders/RGBELoader.js';

// Conditional parameters
const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const ADD_PLANE_TO_THE_SCENE = true; // Set this to true to add a plane to the scene

// Reference to the .vv div
const vvElement = document.querySelector('.vv');

// Calculate aspect ratio of the .vv div
const aspectRatio = vvElement.clientWidth / vvElement.clientHeight;

// Create a Stats instance
var stats = new Stats();
var stats2 = new Stats();
// Position it on the top-left corner
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
stats2.showPanel(2); // 0: fps, 1: ms, 2: mb, 3+: custom
vvElement.appendChild(stats.dom);
vvElement.appendChild(stats2.dom);
// Adjust style of the stats to position it correctly within the div
stats.dom.style.position = 'absolute';
stats.dom.style.top = '0px';
stats.dom.style.left = '10%';

stats2.dom.style.position = 'absolute';
stats2.dom.style.top = '0px';
stats2.dom.style.left = '20%';

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

// Apply border-radius to the canvas
renderer.domElement.style.borderRadius = '1rem';

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
// Adjust the material properties of the cube
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
  opacity: 1      // Adjust opacity here, 0 is fully transparent, 1 is fully opaque
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
rgbeLoader.load('safari_sunset_2k.hdr', function (texture) {
  texture.mapping = THREE.EquirectangularReflectionMapping;
  if (USE_BACKGROUND_TEXTURE) {
    scene.background = texture;
  }
  scene.environment = texture;
});

// Double-Check the Renderer's Clear Color
renderer.setClearColor(0x000000, 0); // Adjust the color and alpha as needed for the scene

// Revisit Ambient Light
ambientLight.intensity = 1; // Adjust as needed for your scene

// Logging for Debugging
console.log('Clear Alpha:', renderer.getClearAlpha());

// Animation loop
function animate() {
  stats.begin(); // Start measuring
  stats2.begin(); // Start measuring
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  controls.update();
    renderer.render(scene, camera); // Use standard rendering
  
  stats.end(); // Stop measuring
  stats2.end(); // Stop measuring
}

animate();

// animation
renderer.setAnimationLoop(animation);
function animation(time) {
  cube.rotation.x = time / 2000;
  cube.rotation.y = time / 1000;
}

document.getElementById('cubeOpacityButton').addEventListener('click', function () {
  cube.material.opacity = cube.material.opacity === 1 ? 0 : 1; // if cube opacity === 1 change to 0 else 1
  console.log('Cube opacity changed to: ' + cube.material.opacity); // Log the change for verification
});

document.getElementById('planeOpacityButton').addEventListener('click', function () {
  plane.material.opacity = plane.material.opacity === 1 ? 0 : 1; // if plane opacity === 1 change to 0 else 1
  console.log('Plane opacity changed to: ' + plane.material.opacity); // Log the change for verification
});