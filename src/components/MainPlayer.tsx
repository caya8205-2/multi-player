import "./MainPlayer.css";

interface Props {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (time: number) => void;
  itemCount: number;
}

function formatTime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function MainPlayer({ isPlaying, currentTime, duration, onPlay, onPause, onSeek, itemCount }: Props) {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

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
          className="seekbar"
          onClick={(e) => {
            if (duration === 0) return;
            const rect = e.currentTarget.getBoundingClientRect();
            const ratio = (e.clientX - rect.left) / rect.width;
            onSeek(ratio * duration);
          }}
        >
          <div className="seekbar-fill" style={{ width: `${progress}%` }} />
          <div className="seekbar-thumb" style={{ left: `${progress}%` }} />
        </div>
      </div>

      <div className="player-right">
        <span className="item-count">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
      </div>
    </div>
  );
}
