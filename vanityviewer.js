import * as THREE from '/three.js-dev/build/three.module.min.js';
import { OrbitControls } from '/three.js-dev/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/three.js-dev/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from '/three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import Stats from '/three.js-dev/examples/jsm/libs/stats.module.js';
import { USE_BACKGROUND_TEXTURE, USE_SUN_LIGHT, ADD_PLANE_TO_THE_SCENE, ADD_PERFORMANCE_MONITOR } from '/config.js';

function initViewer(container,
  modelPath,
  skyboxHdriPath,
  environmentHdriPath,
  materialRoughness,
  materialMetalness,
  cameraMinDistance,
  cameraMaxDistance,
  modelScale) {

  const aspectRatio = container.clientWidth / container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.set(1, 1, 1);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
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
  controls.minDistance = cameraMinDistance;
  controls.maxDistance = cameraMaxDistance;

  const loader = new GLTFLoader();
  let modelMesh;

  loader.load(modelPath, (gltf) => {
    modelMesh = gltf.scene;
    modelMesh.position.set(0, 0, 0);
    modelMesh.scale.set(modelScale, modelScale, modelScale);
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

  const light = new THREE.DirectionalLight(0xffffff, 10);
  light.position.set(2, 10, 5);
  light.castShadow = true;

  light.shadow.mapSize.width = 1024;  // Increase shadow map size to 2048 for better quality
  light.shadow.mapSize.height = 1024;
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

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  ambientLight.intensity = 1;

  const rgbeLoader = new RGBELoader();

  // Load the environment HDR
  rgbeLoader.load(environmentHdriPath, function (environmentTexture) {
    environmentTexture.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = environmentTexture;
  });

  // Load the skybox HDR (if needed)
  let skyboxTexture = null;
  if (USE_BACKGROUND_TEXTURE) {
    rgbeLoader.load(skyboxHdriPath, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      skyboxTexture = texture;
      if (container.getAttribute('data-display-skybox-enabled') === 'true') {
        scene.background = skyboxTexture;
      }
    });
  }


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
  const skyboxHdriPath = container.getAttribute('data-skybox-hdri-path');
  const environmentHdriPath = container.getAttribute('data-environment-hdri-path');
  const materialRoughness = parseFloat(container.getAttribute('data-material-roughness')) || 0.5; // Use the user value or default to the default value 
  const materialMetalness = parseFloat(container.getAttribute('data-material-metalness')) || 0.5;
  const cameraMinDistance = parseFloat(container.getAttribute('data-camera-min-distance')) || 1;
  const cameraMaxDistance = parseFloat(container.getAttribute('data-camera-max-distance')) || 10;
  const modelScale = parseFloat(container.getAttribute('data-model-scale'));

  if (modelPath && skyboxHdriPath && environmentHdriPath) {
    initViewer(container,
      modelPath,
      skyboxHdriPath,
      environmentHdriPath,
      materialRoughness,
      materialMetalness,
      cameraMinDistance,
      cameraMaxDistance,
      modelScale);
  }
});
