# 3D Avatar Interaction Website

A futuristic AI-Powered 3D Avatar Interaction Website built with React, React Three Fiber, Drei, and Framer Motion.

## 🚀 Features

- **3D Animated Avatar** - Load and animate GLB models with idle animations, gestures, and expressions
- **Dynamic Lighting** - Neon/holographic lighting effects with customizable environments
- **Interactive UI** - Chat interface, voice controls, expression menu, and gesture controls
- **Futuristic Design** - Glassmorphism, neon effects, and sci-fi aesthetics
- **Responsive** - Works on desktop and mobile devices
- **Multiple Pages** - Home, Interact, and Customize pages

## 📁 Project Structure

```
3D Project/
├── public/
│   └── models/          # Place your .glb avatar files here
├── src/
│   ├── components/
│   │   ├── AvatarScene.jsx      # Main 3D scene container
│   │   ├── AvatarModel.jsx      # 3D avatar with animations
│   │   ├── ChatUI.jsx           # Chat interface
│   │   ├── VoiceControls.jsx    # Voice input controls
│   │   ├── ExpressionMenu.jsx   # Expression selector
│   │   ├── GestureMenu.jsx      # Gesture controls
│   │   ├── ThemeToggle.jsx      # Dark/Light theme toggle
│   │   ├── EnvironmentSelector.jsx  # Environment presets
│   │   ├── HUDOverlay.jsx       # HUD status overlay
│   │   └── Layout.jsx           # Main layout with navigation
│   ├── pages/
│   │   ├── Home.jsx             # Landing page
│   │   ├── Interact.jsx        # Interaction page
│   │   └── Customize.jsx       # Customization page
│   ├── store/
│   │   └── useStore.js         # Zustand state management
│   ├── styles/
│   │   ├── global.css          # Global styles
│   │   └── [component].css     # Component-specific styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx                # Entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🛠️ Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Add your 3D model:**
   - Place your `.glb` avatar file in `public/models/avatar.glb`
   - Or update the `modelPath` prop in `AvatarModel.jsx`

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🎨 Customization

### Adding Your 3D Model

1. Export your avatar as a `.glb` file with animations
2. Place it in `public/models/avatar.glb`
3. The component will automatically load it

### Animation Names

For best results, name your animations:
- `Idle` or `idle` - Default idle animation
- `wave` - Waving gesture
- `nod` - Nodding gesture
- `shake` - Shaking head gesture
- Or any custom animation names

### Expressions (Morph Targets)

If your model supports morph targets, name them:
- `happy`, `sad`, `surprised`, `angry`, `neutral`, `excited`

### Environment Presets

Available environments:
- `city`, `sunset`, `night`, `dawn`, `warehouse`, `forest`, `apartment`, `studio`

## 🎯 Usage

### Interacting with the Avatar

1. **Chat**: Type messages in the chat interface to trigger avatar reactions
2. **Voice**: Click the voice button to activate voice commands
3. **Expressions**: Click expression buttons to change avatar facial expressions
4. **Gestures**: Click gesture buttons to trigger one-shot animations
5. **Environment**: Change the 3D environment in the Customize page

### Animation System

- **Idle Animation**: Plays automatically when no other animation is active
- **Gesture Animations**: One-shot animations that return to idle when finished
- **Expression Morphing**: Changes facial expressions using morph targets
- **Animation Blending**: Smooth transitions between animations

## 🎨 Styling

The project uses CSS custom properties for easy theming:

```css
--neon-cyan: #00ffff;
--neon-pink: #ff00ff;
--neon-blue: #0080ff;
--bg-dark: #0a0a0f;
```

Modify these in `src/styles/global.css` to customize colors.

## 📦 Dependencies

- **React 18** - UI framework
- **React Router DOM** - Navigation
- **React Three Fiber** - 3D rendering
- **@react-three/drei** - Three.js helpers
- **Three.js** - 3D graphics library
- **Framer Motion** - Animations
- **Zustand** - State management
- **Vite** - Build tool

## 🐛 Troubleshooting

### Model Not Loading

- Ensure the file path is correct
- Check that the file is in `public/models/`
- Verify the file is a valid `.glb` format
- The component will show a placeholder if the model fails to load

### Animations Not Working

- Verify your model includes animation data
- Check animation names match expected names (Idle, wave, etc.)
- Ensure animations are exported with the GLB file

### Performance Issues

- Reduce model complexity
- Lower shadow quality
- Disable auto-rotate on OrbitControls
- Reduce environment complexity

## 🚧 Future Enhancements

- [ ] Real voice recognition integration
- [ ] More avatar customization options
- [ ] Export/import avatar configurations
- [ ] Multi-avatar support
- [ ] AR/VR compatibility
- [ ] Real-time AI responses

## 📝 License

This project is open source and available for personal and commercial use.

## 🤝 Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

---

**Built with ❤️ using React Three Fiber**


