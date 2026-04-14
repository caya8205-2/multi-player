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
