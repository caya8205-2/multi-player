# Multiplayer App

**Multiplayer App** adalah aplikasi desktop berbasis [Tauri](https://tauri.app/) yang memungkinkan kamu untuk memutar berbagai media secara bersamaan dalam satu kanvas interaktif. Kamu bisa mengatur tata letak (layout) setiap media sesuka hati, menyimpannya sebagai preset, dan memutarnya secara sinkron.

<p align="center">
  <img src="public/logo.svg" width="128" alt="Multiplayer App Logo">
</p>

## Fitur Utama

- **Multi-Media Support**: Putar Video, Gambar, GIF, dan Audio secara bersamaan.
- **Interactive Canvas**: Drag-and-drop media di mana saja. Ubah ukuran (resize) setiap elemen dengan mudah.
- **Master Control**: Kontrol playback (Play, Pause, Seek, Volume) untuk semua media video secara sinkron.
- **Layout Presets**: Simpan konfigurasi posisi dan ukuran jendela media favoritmu.
- **Session Saving**: Simpan seluruh sesi kerja (termasuk file path dan layout) untuk dilanjutkan nanti.
- **Native Performance**: Dibangun dengan Rust dan Tauri untuk performa yang ringan dan cepat.

## Tech Stack

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Backend/Core**: [Tauri](https://tauri.app/) (Rust)
- **Styling**: Vanilla CSS
- **Components**: `react-rnd` untuk interaksi resize & drag.

## Memulai

### Prasyarat
- [Node.js](https://nodejs.org/) (versi terbaru)
- [Rust](https://www.rust-lang.org/tools/install)
- Build tools untuk Windows (C++ build tools)

### Instalasi

1. Clone repositori ini:
   ```bash
   git clone https://github.com/username/multiplayer-app.git
   cd multiplayer-app
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

### Jalankan di Mode Pengembangan
```bash
npm run tauri dev
```

### Build Aplikasi
```bash
npm run tauri build
```

## Cara Penggunaan

1. **Tambah Media**: Klik tombol **"Add Media"** pada toolbar atau langsung **Drag & Drop** file media ke dalam aplikasi.
2. **Atur Layout**: Geser media atau tarik ujungnya untuk mengubah ukuran.
3. **Simpan Preset**: Gunakan menu Preset di toolbar untuk menyimpan tata letak yang sudah kamu buat.
4. **Master Player**: Gunakan bar kontrol di bagian bawah untuk mengatur semua video sekaligus.

## Lisensi

Proyek ini berada di bawah lisensi MIT. Silakan gunakan dan modifikasi sesuai kebutuhan.

---
Dibuat menggunakan Tauri + React.
