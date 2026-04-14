import { useState, useRef, useCallback } from "react";
import { Rnd } from "react-rnd";
import MediaCard from "./components/MediaCard";
import MainPlayer from "./components/MainPlayer";
import Toolbar from "./components/Toolbar";
import { MediaItem } from "./types";
import "./App.css";

let idCounter = 0;

export default function App() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const videoRefs = useRef<Map<number, HTMLVideoElement>>(new Map());
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [masterDuration, setMasterDuration] = useState(0);
  const rafRef = useRef<number | null>(null);
  const masterVideoId = useRef<number | null>(null);

  // Ambil durasi terpanjang dari semua video
  const updateMasterDuration = useCallback((newItems: MediaItem[]) => {
    const durations = newItems
      .filter((i) => i.type === "video")
      .map((i) => i.duration ?? 0);
    const max = durations.length > 0 ? Math.max(...durations) : 0;
    setMasterDuration(max);

    // Master video = video dengan durasi terpanjang
    const master = newItems
      .filter((i) => i.type === "video")
      .reduce((a, b) => ((a.duration ?? 0) >= (b.duration ?? 0) ? a : b), {} as MediaItem);
    masterVideoId.current = master?.id ?? null;
  }, []);

  const addMedia = useCallback((files: FileList) => {
    const newItems: MediaItem[] = [];
    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const type = file.type.startsWith("video")
        ? "video"
        : file.type.startsWith("image")
        ? file.type === "image/gif"
          ? "gif"
          : "image"
        : file.type.startsWith("audio")
        ? "audio"
        : null;

      if (!type) return;

      newItems.push({
        id: idCounter++,
        url,
        type,
        name: file.name,
        duration: undefined,
        x: 80 + Math.random() * 200,
        y: 80 + Math.random() * 100,
        width: type === "audio" ? 320 : 480,
        height: type === "audio" ? 80 : 270,
      });
    });

    setItems((prev) => {
      const updated = [...prev, ...newItems];
      updateMasterDuration(updated);
      return updated;
    });
  }, [updateMasterDuration]);

  const removeItem = useCallback((id: number) => {
    videoRefs.current.delete(id);
    setItems((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      updateMasterDuration(updated);
      return updated;
    });
  }, [updateMasterDuration]);

  const updateItemBounds = useCallback(
    (id: number, bounds: Partial<Pick<MediaItem, "x" | "y" | "width" | "height">>) => {
      setItems((prev) =>
        prev.map((i) => (i.id === id ? { ...i, ...bounds } : i))
      );
    },
    []
  );

  const setVideoDuration = useCallback((id: number, duration: number) => {
    setItems((prev) => {
      const updated = prev.map((i) => (i.id === id ? { ...i, duration } : i));
      updateMasterDuration(updated);
      return updated;
    });
  }, [updateMasterDuration]);

  const registerVideoRef = useCallback((id: number, el: HTMLVideoElement | null) => {
    if (el) videoRefs.current.set(id, el);
    else videoRefs.current.delete(id);
  }, []);

  // Tick loop — sinkronisasi currentTime dari master video
  const tick = useCallback(() => {
    const masterId = masterVideoId.current;
    if (masterId !== null) {
      const masterEl = videoRefs.current.get(masterId);
      if (masterEl) setCurrentTime(masterEl.currentTime);
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  const handlePlay = useCallback(() => {
    videoRefs.current.forEach((el) => el.play().catch(() => {}));
    setIsPlaying(true);
    rafRef.current = requestAnimationFrame(tick);
  }, [tick]);

  const handlePause = useCallback(() => {
    videoRefs.current.forEach((el) => el.pause());
    setIsPlaying(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
  }, []);

  const handleSeek = useCallback((time: number) => {
    videoRefs.current.forEach((el) => {
      el.currentTime = time;
    });
    setCurrentTime(time);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer.files.length > 0) addMedia(e.dataTransfer.files);
    },
    [addMedia]
  );

  return (
    <div className="app" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
      <Toolbar onAddMedia={addMedia} />

      <div className="canvas">
        {items.length === 0 && (
          <div className="empty-state">
            <span className="empty-icon">⬡</span>
            <p>Drop file ke sini atau klik <strong>Add Media</strong></p>
            <p className="empty-sub">Video, Gambar, GIF, Audio — semua didukung</p>
          </div>
        )}

        {items.map((item) => (
          <Rnd
            key={item.id}
            default={{ x: item.x, y: item.y, width: item.width, height: item.height }}
            minWidth={160}
            minHeight={item.type === "audio" ? 60 : 120}
            bounds="parent"
            onDragStop={(_, d) => updateItemBounds(item.id, { x: d.x, y: d.y })}
            onResizeStop={(_, __, ref, ___, pos) =>
              updateItemBounds(item.id, {
                width: parseInt(ref.style.width),
                height: parseInt(ref.style.height),
                x: pos.x,
                y: pos.y,
              })
            }
            className="rnd-wrapper"
          >
            <MediaCard
              item={item}
              onRemove={() => removeItem(item.id)}
              onDurationLoaded={(d) => setVideoDuration(item.id, d)}
              registerVideoRef={registerVideoRef}
              isMaster={masterVideoId.current === item.id}
            />
          </Rnd>
        ))}
      </div>

      <MainPlayer
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={masterDuration}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        itemCount={items.length}
      />
    </div>
  );
}
