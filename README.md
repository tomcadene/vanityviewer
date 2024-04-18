A versatile 3D model viewer designed for seamless integration into any website. This foundation tool enables easy display and interaction with 3D models.

## Key Features:
### Accessible conditional parameters
```javascript
const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const ADD_PLANE_TO_THE_SCENE = false; // Set this to true to add a plane to the scene
```
### Reference to the .mv div
```javascript
const mvElement = document.querySelector('.mv');
```

### Automated support for your model (scene, camera, renderer, window resize, light, reflections)
```javascript
yourModel.castShadow = true;
yourModel.receiveShadow = true;
```
