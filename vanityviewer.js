import * as THREE from '/three.js-dev/build/three.module.min.js';
import { OrbitControls } from '/three.js-dev/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/three.js-dev/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from '/three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import Stats from '/three.js-dev/examples/jsm/libs/stats.module.js';
import {
  USE_BACKGROUND_TEXTURE,
  USE_SUN_LIGHT,
  ADD_PLANE_TO_THE_SCENE,
  SHADOW_TYPE as SHADOW_TYPE_PLACEHOLDER,
  SHADOW_MAP_SIZE,
  DISABLE_COLOR_CORRECTION,
  ADD_PERFORMANCE_MONITOR,
  ADD_DEBUGGING_TOOLS
} from '/config.js';

function initViewer(container,
  modelPath,
  skyboxHdriPaths,
  environmentHdriPaths,
  materialRoughness,
  materialMetalness,
  lightStrength,
  lightPositionX,
  lightPositionY,
  lightPositionZ,
  cameraMinDistance,
  cameraMaxDistance,
  modelScale) {

  const aspectRatio = container.clientWidth / container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.set(10, 10, 10);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  const SHADOW_TYPE = ({
    'PCFSoftShadowMap': THREE.PCFSoftShadowMap,
    'BasicShadowMap': THREE.BasicShadowMap,
    'PCFShadowMap': THREE.PCFShadowMap,
    'VSMShadowMap': THREE.VSMShadowMap
  })[SHADOW_TYPE_PLACEHOLDER];

  renderer.shadowMap.type = SHADOW_TYPE;

  if (!DISABLE_COLOR_CORRECTION) {
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
  }
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.physicallyCorrectLights = true;
  renderer.autoClear = true;

  // Optimize shadows
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;

  container.appendChild(renderer.domElement);

  renderer.domElement.style.borderRadius = '1rem';

  function onWindowResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onWindowResize);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = cameraMinDistance * 10;
  controls.maxDistance = cameraMaxDistance * 10;

  const loader = new GLTFLoader();
  let modelMesh;

  loader.load(modelPath, (gltf) => {
    modelMesh = gltf.scene;
    modelMesh.position.set(0, 0, 0);
    modelMesh.scale.set(modelScale * 10, modelScale * 10, modelScale * 10);
    modelMesh.castShadow = true;
    modelMesh.receiveShadow = true;
    // Enable shadows for each child mesh in the model
    modelMesh.traverse(function (node) {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        node.material.roughness = materialRoughness;
        node.material.metalness = materialMetalness;
        // Optional: Optimize material properties for better performance
        node.material.precision = 'mediump';
        // Ensure frustum culling is enabled (default is true)
        node.frustumCulled = true;
      }
    });
    scene.add(modelMesh);

    // Optimize shadow map update
    renderer.shadowMap.needsUpdate = true;
  }, undefined, function (error) {
    console.error('An error happened while loading the model:', error);
  });


  const planeGeometry = new THREE.PlaneGeometry(10000, 10000);
  const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5, side: THREE.DoubleSide });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = -Math.PI / 2;
  plane.receiveShadow = true;

  if (ADD_PLANE_TO_THE_SCENE) {
    scene.add(plane);
  }

  const light = new THREE.DirectionalLight(0xffffff, lightStrength);
  light.position.set(lightPositionX, lightPositionY, lightPositionZ);
  light.castShadow = true;

  light.shadow.mapSize.width = SHADOW_MAP_SIZE;
  light.shadow.mapSize.height = SHADOW_MAP_SIZE;
  light.shadow.camera.near = 0.5;
  light.shadow.camera.far = 50;

  // Adjust shadow camera bounds to fit the scene
  light.shadow.camera.left = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;
  light.shadow.camera.bottom = -10;

  // Adjust shadow bias to reduce artifacts
  light.shadow.bias = -0.005;

  if (USE_SUN_LIGHT) {
    scene.add(light);
  }

  // Adding an arrow helper to visualize the light direction
  const direction = new THREE.Vector3(lightPositionX, lightPositionY, lightPositionZ).normalize(); // Light direction vector
  const origin = new THREE.Vector3(0, 0, 0); // Origin of the arrow (can be adjusted)
  const length = 50; // Length of the arrow
  const color = 0xffff00; // Color of the arrow (yellow)

  // Create the ArrowHelper
  const arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);

  if (ADD_DEBUGGING_TOOLS) {
    scene.add(arrowHelper);
  }

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  ambientLight.intensity = 0.2;

  const rgbeLoader = new RGBELoader();

  let skyboxTexture = null;
  let environmentTexture = null;

  function loadEnvironment(hdriPath) {
    rgbeLoader.load(hdriPath, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      environmentTexture = texture;
    });
  }

  function loadSkybox(hdriPath) {
    rgbeLoader.load(hdriPath, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      skyboxTexture = texture;
      if (container.getAttribute('data-display-skybox-enabled') === 'true') {
        scene.background = skyboxTexture;
      }
    });
  }

  // Load initial HDRIs
  loadEnvironment(environmentHdriPaths[0]);
  loadSkybox(skyboxHdriPaths[0]);

  // Populate HDRI selectors
  const skyboxSelector = document.createElement('select');
  skyboxSelector.className = 'skybox-selector';
  container.appendChild(skyboxSelector);
  skyboxHdriPaths.forEach((path, index) => {
    const option = document.createElement('option');
    option.value = path;
    option.textContent = `Skybox ${index + 1}`;
    skyboxSelector.appendChild(option);
  });

  const environmentSelector = document.createElement('select');
  environmentSelector.className = 'environment-selector';
  container.appendChild(environmentSelector);
  environmentHdriPaths.forEach((path, index) => {
    const option = document.createElement('option');
    option.value = path;
    option.textContent = `Environment ${index + 1}`;
    environmentSelector.appendChild(option);
  });

  skyboxSelector.addEventListener('change', (event) => {
    loadSkybox(event.target.value);
  });

  environmentSelector.addEventListener('change', (event) => {
    loadEnvironment(event.target.value);
  });


  renderer.setClearColor(0x000000, 0);

  // Frustum Culling Optimization, Ensure objects outside the camera view are not rendered.
  scene.traverse(function (object) {
    if (object.isMesh) {
      object.frustumCulled = true;
    }
  });

  // Create the container for stats dynamically
  var statsContainer = document.createElement('div');
  statsContainer.id = 'stats-container';
  container.appendChild(statsContainer);

  // Apply styles to the container
  statsContainer.style.display = 'flex';
  statsContainer.style.position = 'absolute';
  statsContainer.style.top = '0';
  statsContainer.style.left = '0';

  // Initialize stats
  var stats1 = new Stats();
  stats1.showPanel(0); // 0: FPS

  var stats2 = new Stats();
  stats2.showPanel(1); // 1: MS

  var stats3 = new Stats();
  stats3.showPanel(2); // 2: Memory

  stats1.dom.style.position = 'static';
  stats2.dom.style.position = 'static';
  stats3.dom.style.position = 'static';

  if (ADD_PERFORMANCE_MONITOR) {
    statsContainer.appendChild(stats1.dom);
    statsContainer.appendChild(stats2.dom);
    statsContainer.appendChild(stats3.dom);
  }

  function animate() {
    stats1.begin();
    stats2.begin();
    stats3.begin();
    requestAnimationFrame(animate);

    if (modelMesh && container.getAttribute('data-rotate-enabled') === 'true') {
      modelMesh.rotation.y += 0.01;
    }


    controls.update();
    renderer.render(scene, camera);

    // Update skybox visibility based on the checkbox
    if (container.getAttribute('data-display-skybox-enabled') === 'true') {
      scene.background = skyboxTexture;
    } else {
      scene.background = null;
    }

    stats1.end();
    stats2.end();
    stats3.end();
  }

  animate();

  const rotateModelCheckbox = container.querySelector('.rotateModelCheckbox');
  if (rotateModelCheckbox) {
    rotateModelCheckbox.addEventListener('change', function () {
      container.setAttribute('data-rotate-enabled', rotateModelCheckbox.checked ? 'true' : 'false');
    });
    // Set initial state
    container.setAttribute('data-rotate-enabled', rotateModelCheckbox.checked ? 'true' : 'false');
  }

  const displaySkyboxCheckbox = container.querySelector('.displaySkyboxCheckbox');
  if (displaySkyboxCheckbox) {
    displaySkyboxCheckbox.addEventListener('change', function () {
      container.setAttribute('data-display-skybox-enabled', displaySkyboxCheckbox.checked ? 'true' : 'false');
    });
    // Set initial state
    container.setAttribute('data-display-skybox-enabled', displaySkyboxCheckbox.checked ? 'true' : 'false');
  }



}

// Automatically initialize all viewers
// The container is any HTML element with the class .vv. The script looks for all elements with the class .vv, retrieves their attributes, and then initializes the Three.js viewer for each of these elements by passing them as the container argument to the initViewer function.
document.querySelectorAll('.vv').forEach(container => {
  const modelPath = container.getAttribute('data-model-path');
  const skyboxHdriPaths = container.getAttribute('data-skybox-hdri-path').split(',');
  const environmentHdriPaths = container.getAttribute('data-environment-hdri-path').split(',');
  const materialRoughness = parseFloat(container.getAttribute('data-material-roughness')) || 0.5; // Use the user value or default to the default value 
  const materialMetalness = parseFloat(container.getAttribute('data-material-metalness')) || 0.5;
  const lightStrength = parseFloat(container.getAttribute('data-light-strength')) || 1;
  const lightPositionX = parseFloat(container.getAttribute('data-light-position-x')) || 2;
  const lightPositionY = parseFloat(container.getAttribute('data-light-position-y')) || 10;
  const lightPositionZ = parseFloat(container.getAttribute('data-light-position-z')) || 5;
  const cameraMinDistance = parseFloat(container.getAttribute('data-camera-min-distance')) || 1;
  const cameraMaxDistance = parseFloat(container.getAttribute('data-camera-max-distance')) || 10;
  const modelScale = parseFloat(container.getAttribute('data-model-scale')) || 10;

  if (modelPath && skyboxHdriPaths && environmentHdriPaths) {
    initViewer(container,
      modelPath,
      skyboxHdriPaths,
      environmentHdriPaths,
      materialRoughness,
      materialMetalness,
      lightStrength,
      lightPositionX,
      lightPositionY,
      lightPositionZ,
      cameraMinDistance,
      cameraMaxDistance,
      modelScale);
  }
});
