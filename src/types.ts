export type MediaType = "video" | "image" | "gif" | "audio";

export interface MediaItem {
  id: number;
  url: string;
  type: MediaType;
  name: string;
  duration?: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Preset {
  id: string;
  name: string;
  layout: Array<{
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
  createdAt: number;
}

export interface SessionPreset {
  id: string;
  name: string;
  createdAt: number;
  items: Array<{
    path: string;       // absolute path file asli
    name: string;
    type: MediaType;
    x: number;
    y: number;
    width: number;
    height: number;
  }>;
}