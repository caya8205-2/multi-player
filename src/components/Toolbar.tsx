import { useState, useRef } from "react";
import "./Toolbar.css";
import { Preset, SessionPreset } from "../types";

interface Props {
  onAddMedia: (files: FileList) => void;
  onClearAll: () => void;
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onLoadPreset: (preset: Preset) => void;
  onDeletePreset: (id: string) => void;
  sessionPresets: SessionPreset[];
  onSaveSessionPreset: (name: string) => void;
  onLoadSessionPreset: (preset: SessionPreset) => void;
  onDeleteSessionPreset: (id: string) => void;
}

export default function Toolbar({
  onAddMedia,
  onClearAll,
  presets,
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  sessionPresets,
  onSaveSessionPreset,
  onLoadSessionPreset,
  onDeleteSessionPreset
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);
  const [showSessionPresets, setShowSessionPresets] = useState(false);

  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <img src="/logo.svg" alt="Logo" className="toolbar-logo" />
        <span className="toolbar-title">MultiPlayer</span>
      </div>
      <button className="btn-add" onClick={() => inputRef.current?.click()}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Add Media
      </button>

      <button className="btn-clear" onClick={onClearAll}>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <line x1="5" y1="5" x2="19" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="19" y1="5" x2="5" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        Clear
      </button>

      {/* Preset Layout */}
      <div className="preset-group">
        <button className="btn-preset-save" onClick={() => {
          const name = prompt("Nama layout preset:");
          if (name?.trim()) onSavePreset(name.trim());
        }}>
          Save Layout
        </button>
        <button
          className={`btn-preset-toggle ${showPresets ? "active" : ""}`}
          onClick={() => setShowPresets(p => !p)}
          disabled={presets.length === 0}
        >
          Layouts
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <polyline
              points={showPresets ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
        {showPresets && (
          <div className="preset-dropdown">
            {presets.map(p => (
              <div key={p.id} className="preset-item">
                <span onClick={() => { onLoadPreset(p); setShowPresets(false); }}>{p.name}</span>
                <button onClick={() => onDeletePreset(p.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset Session */}
      <div className="preset-group">
        <button className="btn-preset-save" onClick={() => {
          const name = prompt("Nama session preset:");
          if (name?.trim()) onSaveSessionPreset(name.trim());
        }}>
          Save Session
        </button>
        <button
          className={`btn-preset-toggle ${showSessionPresets ? "active" : ""}`}
          onClick={() => setShowSessionPresets(p => !p)}
          disabled={sessionPresets.length === 0}
        >
          Sessions
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <polyline
              points={showSessionPresets ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            />
          </svg>
        </button>
        {showSessionPresets && (
          <div className="preset-dropdown">
            {sessionPresets.map(p => (
              <div key={p.id} className="preset-item">
                <span onClick={() => { onLoadSessionPreset(p); setShowSessionPresets(false); }}>{p.name}</span>
                <button onClick={() => onDeleteSessionPreset(p.id)}>✕</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="video/*,image/*,audio/*"
        style={{ display: "none" }}
        onChange={(e) => {
          if (e.target.files?.length) {
            onAddMedia(e.target.files);
            e.target.value = "";
          }
        }}
      />
    </div>
  );
}
