import { useEffect, useRef } from "react";
import { MediaItem } from "../types";
import "./MediaCard.css";

interface Props {
  item: MediaItem;
  onRemove: () => void;
  onDurationLoaded: (duration: number) => void;
  registerVideoRef: (id: number, el: HTMLVideoElement | null) => void;
  isMaster: boolean;
}

export default function MediaCard({ item, onRemove, onDurationLoaded, registerVideoRef, isMaster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
