# Public Assets

## Models Directory

Place your 3D avatar `.glb` files in the `models/` directory.

### Recommended Model Specifications:
- Format: GLB (binary glTF)
- Include animations: Idle, wave, nod, shake, etc.
- Include morph targets for expressions (optional)
- Optimize for web (keep file size reasonable)

### Example Structure:
```
public/
└── models/
    └── avatar.glb
```

The app will automatically load models from this directory.

