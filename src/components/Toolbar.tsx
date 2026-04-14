import { useRef } from "react";
import "./Toolbar.css";

interface Props {
  onAddMedia: (files: FileList) => void;
}

export default function Toolbar({ onAddMedia }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="toolbar">
      <span className="toolbar-title">⬡ MultiPlayer</span>
      <button className="btn-add" onClick={() => inputRef.current?.click()}>
        + Add Media
      </button>
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
