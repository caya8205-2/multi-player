import { writeTextFile, readTextFile, exists } from "@tauri-apps/api/fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { MediaItem, SessionPreset } from "./types";

const FILE = "session-presets.json";
const BASE = { dir: BaseDirectory.AppData };

// Load semua preset dari disk
export async function loadSessionPresets(): Promise<SessionPreset[]> {
    try {
        const fileExists = await exists(FILE, BASE);
        if (!fileExists) return [];
        const raw = await readTextFile(FILE, BASE);
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

async function persistPresets(presets: SessionPreset[]) {
    await writeTextFile(FILE, JSON.stringify(presets), BASE);
}

// Tambah preset baru dari state items sekarang
export async function saveSessionPreset(
    name: string,
    items: MediaItem[],
    getFilePath: (id: number) => string | undefined
): Promise<SessionPreset> {
    const preset: SessionPreset = {
        id: crypto.randomUUID(),
        name,
        createdAt: Date.now(),
        items: items
            .map((item) => {
                const path = getFilePath(item.id);
                if (!path) return null;
                return {
                    path,
                    name: item.name,
                    type: item.type,
                    x: item.x,
                    y: item.y,
                    width: item.width,
                    height: item.height,
                };
            })
            .filter(Boolean) as SessionPreset["items"],
    };

    const existing = await loadSessionPresets();
    await persistPresets([...existing, preset]);
    return preset;
}

// Restore items dari preset — convert path ke object URL
export async function restoreSessionPreset(
    preset: SessionPreset
): Promise<Omit<MediaItem, "id" | "duration">[]> {
    return preset.items.map((item) => ({
        url: convertFileSrc(item.path),
        name: item.name,
        type: item.type,
        x: item.x,
        y: item.y,
        width: item.width,
        height: item.height,
    }));
}

// Hapus preset by id
export async function deleteSessionPreset(id: string): Promise<void> {
    const existing = await loadSessionPresets();
    await persistPresets(existing.filter((p) => p.id !== id));
}