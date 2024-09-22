A versatile 3D model viewer designed for seamless integration into any website. Leveraging three.js library, this foundation tool enables easy display and interaction with 3D models. The viewer is built to be highly accessible and compatible across different devices and browsers, ensuring a smooth user experience.

## Preview
Menus and skybox enabled

![vv_2](https://github.com/user-attachments/assets/f341b993-29fa-4b4d-aa5c-040aaacf1d93)


With debugging tools

![vv_3](https://github.com/user-attachments/assets/4ab3dca5-28fa-47a2-ba73-5a9d8444c06c)

## What makes it accessible
- 📄 **Accessible customizable Settings:** Allows customization of lighting, shadow, background, and other display settings to enhance the viewing experience using HTML data attributes, with all processing handled using JavaScript.
- 📚 **No dependencies:** The three.js library is alreary present in the repo.

## Use cases
- 🛍️ **Online Store:** Retailers can use 3D models to enhance product listings, boosting engagement and sales.
- 🖥️ **Artist Portfolio:** Artists can embed 3D models in their websites for a detailed, interactive showcase.
- 🔧 **Virtual Prototyping:** Designers can share interactive models for feedback before manufacturing.
- 🏫 **Education:** Educators can teach complex subjects with interactive 3D models.
- 🎮 **VR/AR Development:** Developers can preview 3D models to ensure optimal assets for their projects.

## Key Features:
- **Interactive Viewing:** Tools to rotate, zoom, pan models to view them from any angle, change the skybox and equirectangular mapping on the fly.
- **Responsive Design:** Optimized for performance on desktops, tablets, and mobile devices.
- **Customizable UI:** Adjustable interface to cater to specific user needs and preferences.
- **Embeddable:** Easily integrate into web applications using simple embedding options.
- **Accessible customizable Settings:** Allows customization of lighting, background, and other display settings to enhance the viewing experience.
- **Automated support for your models:** scene, camera, renderer, window resize, light, shadows, reflections.
- **Control what your user can control:** Allows customization of the ui.

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
- Inside the HTML file of the webpage that will contain the model viewer, add the model viewer container div. This is the actual model viewer. Make sure to replace the path with the path and name of the model and hdri files. If reflections on the model are barely visible it is recommended to use a lower resolution file for the environment. This is also where you modify certain values of the viewer and the model, this method allows to have as many viewers as you like, each with its own values, all without creating redundant code. Bonus, all these data attributes (except model and hdri paths) are optional, so you can safely delete them and the code will take care of them with default values.
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
- You can add as many viewer as you want. Each with its own properties.
```html
<div class="vv" data-model-path="/models/brass_goblets_2k.gltf/brass_goblets_2k.gltf" data-skybox-hdri-path="/hdris/vestibule_2k.hdr" data-environment-hdri-path="/hdris/vestibule_1k.hdr" data-model-scale="1" style="position: relative;"></div>
<div class="vv" data-model-path="/models/barrel_stove_2k.gltf/barrel_stove_2k.gltf" data-skybox-hdri-path="/hdris/safari_sunset_2k.hdr" data-environment-hdri-path="/hdris/safari_sunset_2k.hdr" data-model-scale="2.5" style="position: relative;"></div>

```
- In the vanityviewer-main folder open the config.js file, this is the configuration file where you will select the viewer functionalities.
- Select the viewer functionalities by changing their value by either true or false.
- And you should have a working viewer in your website, good job 😀.

## Data attributes
**All data attributes are optional, so you can safely delete them and the code will take care of it with default values.**
### **Model data attributes**
data-model-path
```html
data-model-path="/models/model.gltf"
```
material-roughness
```html
data-material-roughness="0"
```
material-metalness
```html
data-material-metalness="1"
```
Scale of the model
```html
data-model-scale="2.5"
```

### **Scene data attributes**
skybox-hdri-path
```html
data-skybox-hdri-path="/hdris/vestibule_2k.hdr, /hdris/safari_sunset_2k.hdr"
```
environment-hdri-path
```html
data-environment-hdri-path="/hdris/vestibule_1k.hdr, /hdris/safari_sunset_2k.hdr"
```
skybox
```html
data-skybox="true"
```
plane
```html
data-plane="true"
```
antialiasing
```html
data-antialiasing="true"
```
light-strength
```html
data-light-strength="1"
```
light-position-x
```html
data-light-position-x="2"
```
light-position-y
```html
data-light-position-y="10"
```
light-position-z
```html
data-light-position-z="5"
```
camera-min-distance
```html
data-camera-min-distance="1"
```
camera-max-distance
```html
data-camera-max-distance="10"
```

### **UI data attributes**
Visibility of the "Rotate model" button - true by default, set it to false to disable it
```html
data-ui-hdri="true" 
```
```html
data-ui-wireframe="true" 
```
```html
data-ui-skybox="true"
```
```html
data-ui-rotate="true"
```
Horizontal rotation speed of the object - Recommended value: "0.005"
```html
data-rotation-speed="0.005"
```

### **Misc**
add-debugging-tools
```html
data-add-debugging-tools="true"
```

## Examples
HTML:
```html
<!DOCTYPE html>
<html>
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Vanity Viewer</title>
    <link rel="stylesheet" href="/vanityviewer/styles/styles.css">
</head>
<body>
    <main>
        <div class="vv"
            data-model-path="/models/brass_goblets_2k.gltf/brass_goblets_2k.gltf"
            data-skybox-hdri-path="/hdris/vestibule_2k.hdr, /hdris/safari_sunset_2k.hdr"
            data-environment-hdri-path="/hdris/vestibule_1k.hdr, /hdris/safari_sunset_2k.hdr"
            data-material-roughness="0"
            data-material-metalness="1"
            data-light-strength="1"
            data-light-position-x="2"
            data-light-position-y="10"
            data-light-position-z="5"
            data-camera-min-distance="1"
            data-camera-max-distance="10"
            data-model-scale="2.5"
            style="position: relative;">
        </div>
    </main>
    <script id="vanityviewer" type="module" src="/vanityviewer/vanityviewer.js"></script>
</body>
</html>
```

## Contributing:
Guidelines for contributing to the project, including coding standards, pull requests, and issue reporting.
Contributions are welcome! Please read the CONTRIBUTING.md for details on our code of conduct, and the process for submitting pull requests to us.

## License:
Details about the software license, specifying how it can be used and distributed.
This project is licensed under the MIT License - see the LICENSE file for details.

## Credits:
- <a href="https://polyhaven.com/models">Polyhaven</a> for the default models and hdr files.
