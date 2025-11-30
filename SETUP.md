# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   - The app will automatically open at `http://localhost:3000`
   - If not, navigate to the URL shown in the terminal

## Adding Your 3D Avatar Model

1. **Prepare Your Model**
   - Export as `.glb` format (binary glTF)
   - Include animations if possible (Idle, wave, nod, etc.)
   - Optimize for web (keep file size reasonable)

2. **Place Model File**
   - Copy your `.glb` file to `public/models/avatar.glb`
   - Or update the path in `AvatarModel.jsx` component

3. **Animation Naming**
   For best results, name your animations:
   - `Idle` or `idle` - Default looping animation
   - `wave` - Waving gesture
   - `nod` - Nodding gesture
   - `shake` - Shaking head gesture

4. **Expressions (Optional)**
   If your model has morph targets:
   - Name them: `happy`, `sad`, `surprised`, `angry`, `neutral`, `excited`

## Project Structure

```
3D Project/
├── public/
│   └── models/          # Place .glb files here
├── src/
│   ├── components/      # React components
│   ├── pages/          # Page components
│   ├── store/          # State management
│   └── styles/         # CSS files
└── package.json
```

## Features Overview

- **Home Page**: Landing page with avatar preview
- **Interact Page**: Full interaction interface with chat, voice, expressions, and gestures
- **Customize Page**: Theme and environment customization

## Troubleshooting

### Model Not Loading
- Check file path is correct
- Ensure file is in `public/models/` directory
- Verify file is valid `.glb` format
- Check browser console for errors

### Animations Not Working
- Verify animations are included in GLB file
- Check animation names match expected names
- Ensure animations are properly exported

### Performance Issues
- Reduce model complexity
- Lower polygon count
- Optimize textures
- Disable shadows if needed

## Next Steps

1. Add your 3D model
2. Customize colors in `src/styles/global.css`
3. Adjust lighting in `AvatarScene.jsx`
4. Modify UI components as needed

Enjoy building your 3D Avatar Interaction Website! 🚀

