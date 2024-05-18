// Default select
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

skyboxSelector.addEventListener('change', (event) => {
    loadSkybox(event.target.value);
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

environmentSelector.addEventListener('change', (event) => {
  loadEnvironment(event.target.value);
});
// Default select