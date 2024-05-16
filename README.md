A versatile open-source 3D model viewer designed for seamless integration into any website. Leveraging the powerful three.js library, this foundation tool enables easy display and interaction with 3D models. The viewer is built to be highly accessible and compatible across different devices and browsers, ensuring a smooth user experience.

## What makes it accessible
- 📄 **Accessible customizable Settings:** Remember when you used to modify the value of lines in the .ini file of your games? It's the same here: open the config.js file and select the viewer functionalities, simply set them to true or false.
- 📚 **No dependencies:** The three.js library is alreary present in the repo.
- ⏱️ **Ease of installation:** The viewer can be implemented into any website in ~10min even by a beginner.

## Use cases
- 🛍️ **Online Store:** Retailers can use 3D models to enhance product listings, boosting engagement and sales.
- 🖥️ **Artist Portfolio:** Artists can embed 3D models in their websites for a detailed, interactive showcase.
- 🔧 **Virtual Prototyping:** Designers can share interactive models for feedback before manufacturing.
- 🏫 **Education:** Educators can teach complex subjects with interactive 3D models.
- 🎮 **VR/AR Development:** Developers can preview 3D models to ensure optimal assets for their projects.

## Key Features:
- **Interactive Viewing:** Tools to rotate, zoom, and pan models to view them from any angle.
- **Responsive Design:** Optimized for performance on desktops, tablets, and mobile devices.
- **Customizable UI:** Adjustable interface to cater to specific user needs and preferences.
- **Embeddable:** Easily integrate into web applications using simple embedding options.
- **Accessible customizable Settings:** Allows customization of lighting, background, and other display settings to enhance the viewing experience.
- **Automated support for your models:** scene, camera, renderer, window resize, light, shadows, reflections.
```javascript
const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const ADD_PLANE_TO_THE_SCENE = false; // Set this to true to add a plane to the scene
```

- **Control what your user can control**
```javascript
const ENABLE_INTERFACE = true; // Set this to true to enable the user interface
```

## Live demo
A live demo is present at https://tomcadene.com/projects/vanityviewer.html.
## Usage: 
Examples and documentation on how to use the viewer in various scenarios, such as in art showcases or online retail environments.

## Installation:
Instructions on how to set up and run the model viewer locally, including requirements and dependencies.

- Download the repo, extract it, add the vanityviewer-main folder in the root directory of your website.
- Inside the HTML file of the webpage that will contain the model viewer, add a script tag to include the JavaScript module.
```html
<script id="vanityviewer" type="module" src="vanityviewer-main/vanityviewer.js"></script>
```
- Add your GLTF model(s) in vanityviewer-main/models
- Add your HDR Environment(s) in vanityviewer-main/hdris
- Inside the HTML file of the webpage that will contain the model viewer, add the model viewer container div. This is the actual model viewer. Make sure to replace the path with the path and name of the model and hdri files. If reflections on the model are barely visible it is recommended to use a lower resolution file for the environment. This is also where you modify certain values of the viewer and the model, this method allows to have as many viewers as you like, each with its own values, all without creating redundant code.
```html
<div class="vv" 
            data-model-path="/models/brass_goblets_2k.gltf/brass_goblets_2k.gltf"
            data-skybox-hdri-path="/hdris/vestibule_2k.hdr" 
            data-environment-hdri-path="/hdris/vestibule_1k.hdr"
            data-material-roughness="0"
            data-material-metalness="1"
            data-camera-min-distance="1"
            data-camera-max-distance="10" 
            data-model-scale="2.5"
            style="position: relative;">
</div>
```
- You can add as many viewer as you want.
```html
<div class="vv" data-model-path="/models/brass_goblets_2k.gltf/brass_goblets_2k.gltf" data-skybox-hdri-path="/hdris/vestibule_2k.hdr" data-environment-hdri-path="/hdris/vestibule_1k.hdr" style="position: relative;"></div>
<div class="vv" data-model-path="/models/another_model.gltf" data-skybox-hdri-path="/hdris/another_hdri.hdr" data-environment-hdri-path="/hdris/another_hdri.hdr" style="position: relative;">
<div class="vv" data-model-path="/models/another_model.gltf" data-skybox-hdri-path="/hdris/another_hdri.hdr" data-environment-hdri-path="/hdris/another_hdri.hdr" style="position: relative;">
<div class="vv" data-model-path="/models/another_model.gltf" data-skybox-hdri-path="/hdris/another_hdri.hdr" data-environment-hdri-path="/hdris/another_hdri.hdr" style="position: relative;">
<div class="vv" data-model-path="/models/another_model.gltf" data-skybox-hdri-path="/hdris/another_hdri.hdr" data-environment-hdri-path="/hdris/another_hdri.hdr" style="position: relative;">
```
- In the vanityviewer-main folder open the config.js file, this is the configuration file where you will select the viewer functionalities.
- Select the viewer functionalities by changing their value by either true or false.
- And you should have a working viewer in your website, good job 😀.

## Contributing:
Guidelines for contributing to the project, including coding standards, pull requests, and issue reporting.
Contributions are welcome! Please read the CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## License:
Details about the software license, specifying how it can be used and distributed.
This project is licensed under the MIT License - see the LICENSE file for details.

## Credits:
- Default model originates from Polyhaven and was made by Tina
- Default HDR Environment originates from Polyhaven and was made by Dimitrios Savva (Photography) and  Jarod Guest (Processing)
