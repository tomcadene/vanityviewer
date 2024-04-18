A versatile 3D model viewer designed for seamless integration into any website. This foundation tool enables easy display and interaction with 3D models.

## Key Features:
- Accessible conditional parameters
```javascript
const USE_BACKGROUND_TEXTURE = true; // Set this to true to enable background texture
const ADD_PLANE_TO_THE_SCENE = false; // Set this to true to add a plane to the scene
```

- Seamless integration into any website, reference your div and you're all set
```javascript
const vvElement = document.querySelector('.vv');
```

- Control what your user can control
```javascript
const ENABLE_INTERFACE = true; // Set this to true to enable the user interface
```

- Automated support for your models (scene, camera, renderer, window resize, light, reflections)
```javascript
yourModel.castShadow = true;
yourModel.receiveShadow = true;
```
