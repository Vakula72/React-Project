# 3D Models Directory

Place your `.glb` avatar model files in this directory.

## Recommended Model Setup

### File Location
- Default path: `avatar.glb`
- Or update the `modelPath` prop in `AvatarModel.jsx`

### Animation Requirements

For best results, your GLB model should include:

1. **Idle Animation**
   - Name: `Idle` or `idle`
   - Should loop continuously
   - This is the default animation

2. **Gesture Animations** (optional)
   - `wave` - Waving gesture
   - `nod` - Nodding gesture
   - `shake` - Shaking head gesture
   - `point` - Pointing gesture
   - `clap` - Clapping gesture
   - `thumbsup` - Thumbs up gesture

3. **Morph Targets** (optional, for expressions)
   - `happy` - Happy expression
   - `sad` - Sad expression
   - `surprised` - Surprised expression
   - `angry` - Angry expression
   - `neutral` - Neutral expression
   - `excited` - Excited expression

### Model Tips

- Keep polygon count reasonable for web performance (under 50k triangles recommended)
- Use compressed textures when possible
- Ensure animations are baked/exported with the model
- Test your model in a GLB viewer before adding to the project

### Example Model Sources

- Ready Player Me
- VRoid Hub
- Mixamo (for animations)
- Custom Blender/3DS Max exports

### Troubleshooting

If your model doesn't load:
1. Verify the file path is correct
2. Check browser console for errors
3. Ensure the file is a valid GLB format
4. The app will show a placeholder if the model fails to load

