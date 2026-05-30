# MultiPlayer App

**MultiPlayer App** is a Tauri desktop app for playing multiple media files on one interactive canvas. Add videos, images, GIFs, and audio, arrange them freely or snap them into a clean portrait grid, then control playback from a shared master player.

<p align="center">
  <img src="public/logo.svg" width="128" alt="MultiPlayer App logo">
</p>

## Features

- **Mixed media canvas**: Place videos, images, GIFs, and audio cards in the same workspace.
- **Drag and resize**: Move cards from their header and resize them directly on the canvas.
- **Arrange grid**: Quickly snap active media into a tight portrait grid layout.
- **Master playback**: Play, pause, seek, adjust volume, and change playback speed from the bottom control bar.
- **Per-card audio control**: Adjust volume per card and use solo mode when you need to isolate one source.
- **Layout presets**: Save and reload card positions and sizes.
- **Session presets**: In the desktop build, save media file paths together with the layout so a full session can be restored later.
- **Always-on-top window**: Pin the desktop window above other apps when needed.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/)
- **Build tool**: [Vite](https://vitejs.dev/)
- **Desktop shell**: [Tauri](https://tauri.app/) with Rust
- **Styling**: Vanilla CSS
- **Drag and resize**: [`react-rnd`](https://github.com/bokuweb/react-rnd)

## Getting Started

### Requirements

- [Node.js](https://nodejs.org/)
- [Rust](https://www.rust-lang.org/tools/install)
- Windows C++ build tools

### Install

```bash
npm install
```

### Run in Development

```bash
npm run tauri dev
```

### Build the App

```bash
npm run tauri build
```

## Usage

1. Click **Add Media** or drop supported media files onto the canvas.
2. Drag cards from their header, resize them from the edges, or click **Arrange Grid** for a tight portrait layout.
3. Use **Save Layout** to store the current card positions and sizes.
4. Use **Save Session** in the desktop build to store the media file paths and layout together.
5. Control playback, seeking, global volume, and playback speed from the bottom player.

## Notes

Layout presets are available in both browser development mode and the desktop build. Session presets require the desktop/Tauri build because they depend on local file paths.

## License

MIT. Use and modify it as needed.
