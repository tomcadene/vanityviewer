import * as THREE from '/three.js-master/build/three.module.js';
import { OrbitControls } from '/three.js-master/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/three.js-master/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from '/three.js-master/examples/jsm/loaders/GLTFLoader.js';

// Reference to the .mv div
const mvElement = document.querySelector('.mv');

// Calculate aspect ratio of the .mv div
const aspectRatio = mvElement.clientWidth / mvElement.clientHeight;

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
camera.position.set(2, 2, 5);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(mvElement.clientWidth, mvElement.clientHeight); // Set size to match .mv div
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.25;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.physicallyCorrectLights = true;

mvElement.appendChild(renderer.domElement); // Append renderer to the .mv div instead of body

// Resize handler to ensure the scene adjusts with the viewport/window size
function onWindowResize() {
  // Update camera aspect ratio and renderer size when window resizes
  const width = mvElement.clientWidth;
  const height = mvElement.clientHeight;
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
  metalness: 1,    // Make it fully metallic
  roughness: 0   // Adjust roughness to control how shiny the surface is
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
scene.add(plane); // Add plane to the scene

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
rgbeLoader.load('hdr_file.hdr', function(texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
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

