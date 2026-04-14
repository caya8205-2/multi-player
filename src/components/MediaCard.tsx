import { useEffect, useRef, useState } from "react";
import { MediaItem } from "../types";
import "./MediaCard.css";

interface Props {
  item: MediaItem;
  onRemove: () => void;
  onDurationLoaded: (duration: number) => void;
  registerVideoRef: (id: number, el: HTMLVideoElement | null) => void;
  isMaster: boolean;
  masterVolume: number;
}

export default function MediaCard({ item, onRemove, onDurationLoaded, registerVideoRef, isMaster, masterVolume }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [localVolume, setLocalVolume] = useState(1);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = masterVolume * localVolume;
    }
  }, [masterVolume, localVolume]);

  useEffect(() => {
    if (item.type === "video") {
      registerVideoRef(item.id, videoRef.current);
      return () => registerVideoRef(item.id, null);
    }
  }, [item.id, item.type, registerVideoRef]);

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      onDurationLoaded(videoRef.current.duration);
    }
  };

  // Loop video ketika habis (biar sinkron sama master)
  const handleEnded = () => {
    if (videoRef.current && !isMaster) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  };

  return (
    <div className={`media-card ${isMaster ? "is-master" : ""}`}>
      <div className="card-header">
        <span className="card-name">{item.name}</span>
        <div className="card-badges">
          {isMaster && <span className="badge master">MASTER</span>}
          <span className="badge type">{item.type.toUpperCase()}</span>
          {(item.type === "video" || item.type === "audio") && (
            <input 
              type="range"
              className="card-volume-slider"
              min={0}
              max={1}
              step={0.01}
              value={localVolume}
              onChange={(e) => setLocalVolume(parseFloat(e.target.value))}
              onPointerDown={(e) => e.stopPropagation()}
              title="Volume per Card"
            />
          )}
        </div>
        <button className="btn-remove" onClick={onRemove} title="Hapus">✕</button>
      </div>

      <div className="card-body">
        {item.type === "video" && (
          <video
            ref={videoRef}
            src={item.url}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            className="media-el"
            playsInline
          />
        )}
        {(item.type === "image" || item.type === "gif") && (
          <img src={item.url} className="media-el" alt={item.name} />
        )}
        {item.type === "audio" && (
          <div className="audio-card">
            <span className="audio-icon">♪</span>
            <span className="audio-name">{item.name}</span>
          </div>
        )}
      </div>
    </div>
  );
}
