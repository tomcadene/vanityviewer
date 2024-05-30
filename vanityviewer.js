import * as THREE from '/three.js-dev/build/three.module.min.js';
import { OrbitControls } from '/three.js-dev/examples/jsm/controls/OrbitControls.js'
import { RGBELoader } from '/three.js-dev/examples/jsm/loaders/RGBELoader.js';
import { GLTFLoader } from '/three.js-dev/examples/jsm/loaders/GLTFLoader.js';
import { VertexNormalsHelper } from '/three.js-dev/examples/jsm/helpers/VertexNormalsHelper.js';
import Stats from '/three.js-dev/examples/jsm/libs/stats.module.js';
import {
  USE_BACKGROUND_TEXTURE,
  USE_SUN_LIGHT,
  ADD_PLANE_TO_THE_SCENE,
  SHADOW_TYPE as SHADOW_TYPE_PLACEHOLDER,
  SHADOW_MAP_SIZE,
  DISABLE_COLOR_CORRECTION,
  ADD_DEBUGGING_TOOLS
} from '/config.js';

function initViewer(container,
  modelPath,
  hdriPaths,
  materialRoughness,
  materialMetalness,
  antialiasing,
  lightStrength,
  lightPositionX,
  lightPositionY,
  lightPositionZ,
  cameraMinDistance,
  cameraMaxDistance,
  modelScale,
  uiRotate,
  rotationSpeed) {

  const aspectRatio = container.clientWidth / container.clientHeight;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, aspectRatio, 0.1, 1000);
  camera.position.set(10, 10, 10);

  const antialiasingValue = antialiasing === "true" ? true : false;

  const renderer = new THREE.WebGLRenderer({ antialias: antialiasingValue, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.shadowMap.enabled = true;

  console.log(antialiasingValue)
  console.log(antialiasing)

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
        node.material.wireframe = document.getElementById('renderGeometryAsWireframeCheckbox').checked;
        console.log(container.getAttribute('data-renderGeometryAsWireframe-enabled'))
        // Optional: Optimize material properties for better performance
        node.material.precision = 'mediump';
        // Ensure frustum culling is enabled (default is true)
        node.frustumCulled = true;
      }
    });
    scene.add(modelMesh);

    // Optimize shadow map update
    renderer.shadowMap.needsUpdate = true;

    const SkeletonHelper = new THREE.SkeletonHelper(modelMesh);
    scene.add(SkeletonHelper);

    const vertexNormalsHelper = new VertexNormalsHelper(modelMesh, 1, 0xff0000);

    scene.add(vertexNormalsHelper);
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

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  ambientLight.intensity = 0.2;

  renderer.setClearColor(0x000000, 0);

  // Frustum Culling Optimization, Ensure objects outside the camera view are not rendered.
  scene.traverse(function (object) {
    if (object.isMesh) {
      object.frustumCulled = true;
    }
  });













  const rotateModelCheckbox = document.createElement('input');
  rotateModelCheckbox.type = 'checkbox';
  rotateModelCheckbox.className = 'rotateModelCheckbox';
  rotateModelCheckbox.id = 'rotateModelCheckbox';
  const rotateModelLabel = document.createElement('label');
  rotateModelLabel.htmlFor = 'rotateModelCheckbox';
  rotateModelLabel.innerText = 'Rotate Model';
  const rotateModelContainer = document.createElement('div');
  rotateModelContainer.className = 'checkbox-container';
  rotateModelContainer.appendChild(rotateModelCheckbox);
  rotateModelContainer.appendChild(rotateModelLabel);

  const renderGeometryAsWireframeCheckbox = document.createElement('input');
  renderGeometryAsWireframeCheckbox.type = 'checkbox';
  renderGeometryAsWireframeCheckbox.className = 'renderGeometryAsWireframeCheckbox';
  renderGeometryAsWireframeCheckbox.id = 'renderGeometryAsWireframeCheckbox';
  const renderGeometryAsWireframeLabel = document.createElement('label');
  renderGeometryAsWireframeLabel.htmlFor = 'renderGeometryAsWireframeCheckbox';
  renderGeometryAsWireframeLabel.innerText = 'renderGeometryAsWireframe';
  const renderGeometryAsWireframeContainer = document.createElement('div');
  renderGeometryAsWireframeContainer.className = 'checkbox-container';
  renderGeometryAsWireframeContainer.appendChild(renderGeometryAsWireframeCheckbox);
  renderGeometryAsWireframeContainer.appendChild(renderGeometryAsWireframeLabel);


  const displaySkyboxCheckbox = document.createElement('input');
  displaySkyboxCheckbox.type = 'checkbox';
  displaySkyboxCheckbox.className = 'displaySkyboxCheckbox';
  displaySkyboxCheckbox.id = 'displaySkyboxCheckbox';
  displaySkyboxCheckbox.checked = true;
  const displaySkyboxLabel = document.createElement('label');
  displaySkyboxLabel.htmlFor = 'displaySkyboxCheckbox';
  displaySkyboxLabel.innerText = 'Display Skybox';
  const displaySkyboxContainer = document.createElement('div');
  displaySkyboxContainer.className = 'checkbox-container';
  displaySkyboxContainer.appendChild(displaySkyboxCheckbox);
  displaySkyboxContainer.appendChild(displaySkyboxLabel);

  // Create a new div to wrap both containers
  const flexContainer = document.createElement('div');
  flexContainer.className = 'main-checkbox-container';

  // Append the containers to the new flex container
  const uiRotateValue = uiRotate === "true" ? true : false;
  if (uiRotateValue) {
    flexContainer.appendChild(rotateModelContainer);
  }
  flexContainer.appendChild(renderGeometryAsWireframeContainer);
  flexContainer.appendChild(displaySkyboxContainer);

  // Append the flex container to the main container
  container.appendChild(flexContainer);

  rotateModelCheckbox.addEventListener('change', function () {
    container.setAttribute('data-rotate-enabled', rotateModelCheckbox.checked ? 'true' : 'false');
  });
  container.setAttribute('data-rotate-enabled', rotateModelCheckbox.checked ? 'true' : 'false');

  document.getElementById('renderGeometryAsWireframeCheckbox').addEventListener('change', function () {
    if (modelMesh) {
      modelMesh.traverse(function (node) {
        if (node.isMesh) {
          node.material.wireframe = this.checked;
        }
      }.bind(this));
    }
  });

  displaySkyboxCheckbox.addEventListener('change', function () {
    container.setAttribute('data-display-skybox-enabled', displaySkyboxCheckbox.checked ? 'true' : 'false');
  });
  container.setAttribute('data-display-skybox-enabled', displaySkyboxCheckbox.checked ? 'true' : 'false');















  const rgbeLoader = new RGBELoader();

  let skyboxTexture = null;
  let environmentTexture = null;

  function loadHDRI(hdriPath) {
    rgbeLoader.load(hdriPath, function (texture) {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.environment = texture;
      environmentTexture = texture;
      skyboxTexture = texture;
      if (container.getAttribute('data-display-skybox-enabled') === 'true') {
        scene.background = skyboxTexture;
      }
    });
  }

  // Load initial HDRI
  loadHDRI(hdriPaths[0]);

  // Create a parent container for the dropdown
  const dropdownContainer = document.createElement('div');
  dropdownContainer.className = 'dropdown-container';
  container.appendChild(dropdownContainer);

  // Create custom dropdown container for HDRI selector
  const customDropdown = document.createElement('div');
  customDropdown.className = 'custom-dropdown';
  dropdownContainer.appendChild(customDropdown);

  // Create the visible part of the custom dropdown
  const selected = document.createElement('div');
  selected.className = 'selected';
  selected.textContent = 'Select an HDRI';
  customDropdown.appendChild(selected);

  // Create the dropdown menu
  const dropdownMenu = document.createElement('div');
  dropdownMenu.className = 'dropdown-menu';
  customDropdown.appendChild(dropdownMenu);

  // Populate the dropdown menu with options
  hdriPaths.forEach((path, index) => {
    const dropdownOption = document.createElement('div');
    dropdownOption.className = 'dropdown-option';
    dropdownOption.dataset.value = path;
    dropdownOption.textContent = `HDRI ${index + 1}`;
    dropdownMenu.appendChild(dropdownOption);

    // Add event listener to each option
    dropdownOption.addEventListener('click', () => {
      selected.textContent = dropdownOption.textContent;
      dropdownMenu.classList.remove('show');
      loadHDRI(path);
    });
  });

  // Toggle dropdown menu
  selected.addEventListener('click', () => {
    dropdownMenu.classList.toggle('show');
  });

  // Close the dropdown if clicked outside
  document.addEventListener('click', (event) => {
    if (!customDropdown.contains(event.target)) {
      dropdownMenu.classList.remove('show');
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

  // Adding an arrow helper to visualize the light direction
  const direction = new THREE.Vector3(lightPositionX, lightPositionY, lightPositionZ).normalize(); // Light direction vector
  const origin = new THREE.Vector3(0, 0, 0); // Origin of the arrow (can be adjusted)
  const length = 50; // Length of the arrow
  const color = 0xffff00; // Color of the arrow (yellow)
  const arrowHelper = new THREE.ArrowHelper(direction, origin, length, color);
  const axesHelper = new THREE.AxesHelper(10);
  const sphere = new THREE.SphereGeometry();
  const object = new THREE.Mesh(sphere, new THREE.MeshBasicMaterial(0xff0000));
  const box = new THREE.BoxHelper(object, 0xffff00);
  const CameraHelper = new THREE.CameraHelper(camera);
  const ligthHelper = new THREE.DirectionalLightHelper(light, 5);
  const gridHelper = new THREE.GridHelper(10000, 1000);
  const PolarGridHelper = new THREE.PolarGridHelper(10, 16, 8, 64);

  if (ADD_DEBUGGING_TOOLS) {
    statsContainer.appendChild(stats1.dom);
    statsContainer.appendChild(stats2.dom);
    statsContainer.appendChild(stats3.dom);
    scene.add(arrowHelper);
    scene.add(axesHelper);
    scene.add(box);
    scene.add(CameraHelper);
    scene.add(ligthHelper);
    scene.add(gridHelper);
    scene.add(PolarGridHelper);
  }

















  function animate() {
    stats1.begin();
    stats2.begin();
    stats3.begin();
    requestAnimationFrame(animate);

    if (modelMesh && container.getAttribute('data-rotate-enabled') === 'true') {
      modelMesh.rotation.y += rotationSpeed;
      // Force shadow map update
      renderer.shadowMap.autoUpdate = true;
    } else {
      renderer.shadowMap.autoUpdate = false;
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



}

// Automatically initialize all viewers
// The container is any HTML element with the class .vv. The script looks for all elements with the class .vv, retrieves their attributes, and then initializes the Three.js viewer for each of these elements by passing them as the container argument to the initViewer function.
document.querySelectorAll('.vv').forEach(container => {
  const modelPath = container.getAttribute('data-model-path') || "/models/brass_goblets_2k.gltf/brass_goblets_2k.gltf";
  const hdriPaths = container.getAttribute('data-hdri-path').split(',') || "/hdris/vestibule_2k.hdr, /hdris/safari_sunset_2k.hdr";
  const materialRoughness = parseFloat(container.getAttribute('data-material-roughness')) || 0.5; // Use the user value or default to the default value 
  const materialMetalness = parseFloat(container.getAttribute('data-material-metalness')) || 0.5;
  const antialiasing = container.getAttribute('data-antialiasing') || "true";
  const lightStrength = parseFloat(container.getAttribute('data-light-strength')) || 1;
  const lightPositionX = parseFloat(container.getAttribute('data-light-position-x')) || 2;
  const lightPositionY = parseFloat(container.getAttribute('data-light-position-y')) || 10;
  const lightPositionZ = parseFloat(container.getAttribute('data-light-position-z')) || 5;
  const cameraMinDistance = parseFloat(container.getAttribute('data-camera-min-distance')) || 1;
  const cameraMaxDistance = parseFloat(container.getAttribute('data-camera-max-distance')) || 10;
  const modelScale = parseFloat(container.getAttribute('data-model-scale')) || 10;
  const uiRotate = container.getAttribute('data-ui-rotate') || "true";
  const rotationSpeed = parseFloat(container.getAttribute('data-rotation-speed')) || 0.005;

  if (modelPath && hdriPaths) {
    initViewer(container,
      modelPath,
      hdriPaths,
      materialRoughness,
      materialMetalness,
      antialiasing,
      lightStrength,
      lightPositionX,
      lightPositionY,
      lightPositionZ,
      cameraMinDistance,
      cameraMaxDistance,
      modelScale,
      uiRotate,
      rotationSpeed);
  }
});
