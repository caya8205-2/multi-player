import { useRef, useState } from "react";
import { open } from "@tauri-apps/api/dialog";
import "./Toolbar.css";
import { Preset, SessionPreset } from "../types";

interface Props {
  onAddMedia: (input: FileList | string[]) => void;
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
  const [layoutPresetName, setLayoutPresetName] = useState("");
  const [sessionPresetName, setSessionPresetName] = useState("");
  const isTauri = !!(window as Window & { __TAURI__?: unknown }).__TAURI__;

  const handleAddMedia = async () => {
    if (!isTauri) {
      inputRef.current?.click();
      return;
    }

    const selected = await open({
      multiple: true,
      filters: [{
        name: "Media",
        extensions: ["mp4", "webm", "ogg", "mp3", "wav", "png", "jpg", "jpeg", "webp", "gif", "svg"]
      }]
    });

    if (Array.isArray(selected)) {
      onAddMedia(selected);
    } else if (selected) {
      onAddMedia([selected as string]);
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <img src="/logo.svg" alt="Logo" className="toolbar-logo" />
        <span className="toolbar-title">MultiPlayer</span>
      </div>

      <button className="btn-add" onClick={handleAddMedia}>
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

      <div className="preset-group" title="Simpan dan muat ulang posisi serta ukuran item yang sedang aktif.">
        <span className="preset-kind">Layout</span>
        <input
          type="text"
          value={layoutPresetName}
          onChange={(e) => setLayoutPresetName(e.target.value)}
          placeholder="Nama layout"
          className="preset-name-input"
        />
        <button
          className="btn-preset-save"
          onClick={() => {
            const name = layoutPresetName.trim();
            if (!name) return;
            onSavePreset(name);
            setLayoutPresetName("");
          }}
        >
          Save Layout
        </button>
        <button
          className={`btn-preset-toggle ${showPresets ? "active" : ""}`}
          onClick={() => setShowPresets((prev) => !prev)}
          disabled={presets.length === 0}
        >
          Layouts
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <polyline
              points={showPresets ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {showPresets && (
          <div className="preset-dropdown">
            {presets.map((preset) => (
              <div key={preset.id} className="preset-item">
                <span onClick={() => { onLoadPreset(preset); setShowPresets(false); }}>{preset.name}</span>
                <button onClick={() => onDeletePreset(preset.id)}>x</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div
        className={`preset-group ${!isTauri ? "preset-group-disabled" : ""}`}
        title={isTauri
          ? "Simpan media beserta layout-nya agar bisa dimuat ulang di desktop."
          : "Session preset hanya tersedia di build desktop/Tauri."}
      >
        <span className="preset-kind">Session</span>
        <input
          type="text"
          value={sessionPresetName}
          onChange={(e) => setSessionPresetName(e.target.value)}
          placeholder={isTauri ? "Nama session" : "Desktop only"}
          className="preset-name-input"
          disabled={!isTauri}
        />
        <button
          className="btn-preset-save"
          disabled={!isTauri}
          onClick={() => {
            const name = sessionPresetName.trim();
            if (!name) return;
            onSaveSessionPreset(name);
            setSessionPresetName("");
          }}
        >
          {isTauri ? "Save Session" : "Desktop Only"}
        </button>
        <button
          className={`btn-preset-toggle ${showSessionPresets ? "active" : ""}`}
          onClick={() => setShowSessionPresets((prev) => !prev)}
          disabled={!isTauri || sessionPresets.length === 0}
        >
          Sessions
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <polyline
              points={showSessionPresets ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        {showSessionPresets && (
          <div className="preset-dropdown">
            {sessionPresets.map((preset) => (
              <div key={preset.id} className="preset-item">
                <span onClick={() => { onLoadSessionPreset(preset); setShowSessionPresets(false); }}>{preset.name}</span>
                <button onClick={() => onDeleteSessionPreset(preset.id)}>x</button>
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
