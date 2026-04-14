import { useState, useRef, useEffect } from "react";
import "./MainPlayer.css";

interface Props {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  itemCount: number;
  volume: number;
  onVolumeChange: (vol: number) => void;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MainPlayer({ isPlaying, currentTime, duration, onPlay, onPause, onSeek, itemCount, volume, onVolumeChange }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverLeft, setHoverLeft] = useState<number>(0);
  const seekbarRef = useRef<HTMLDivElement>(null);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handlePointerDown = (e: React.PointerEvent) => {
    if (duration === 0 || !seekbarRef.current) return;
    setIsDragging(true);
    updateSeek(e.clientX);
  };

  const updateSeek = (clientX: number) => {
    if (!seekbarRef.current) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    let ratio = (clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    onSeek(ratio * duration);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDragging) {
        updateSeek(e.clientX);
      }
    };
    const handlePointerUp = () => {
      setIsDragging(false);
      setHoverTime(null);
    };

    if (isDragging) {
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    }
    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, duration, onSeek]);

  const handleSeekbarPointerMove = (e: React.PointerEvent) => {
    if (!seekbarRef.current || duration === 0) return;
    const rect = seekbarRef.current.getBoundingClientRect();
    let ratio = (e.clientX - rect.left) / rect.width;
    ratio = Math.max(0, Math.min(1, ratio));
    setHoverLeft(ratio * 100);
    setHoverTime(ratio * duration);
  };

  const handleSeekbarPointerLeave = () => {
    if (!isDragging) {
      setHoverTime(null);
    }
  };

  return (
    <div className="main-player">
      <div className="player-left">
        <button
          className="btn-play"
          onClick={isPlaying ? onPause : onPlay}
          disabled={itemCount === 0}
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        <span className="time-display">
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>
      </div>

      <div className="player-center">
        <div
          ref={seekbarRef}
          className="seekbar"
          onPointerDown={handlePointerDown}
          onPointerMove={handleSeekbarPointerMove}
          onPointerLeave={handleSeekbarPointerLeave}
        >
          <div className="seekbar-fill" style={{ width: `${progress}%` }} />
          <div className="seekbar-thumb" style={{ left: `${progress}%` }} />
          {hoverTime !== null && (
            <div className="seekbar-tooltip" style={{ left: `${hoverLeft}%` }}>
              {formatTime(hoverTime)}
            </div>
          )}
        </div>
      </div>

      <div className="player-right">
        <input
          type="range"
          className="volume-slider"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          title="Volume"
        />
        <span className="item-count">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
