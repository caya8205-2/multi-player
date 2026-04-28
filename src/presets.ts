import { createDir, writeTextFile, readTextFile, exists } from "@tauri-apps/api/fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { MediaItem, RestoredSessionItem, SessionPreset } from "./types";

const DIR = "presets";
const FILE = `${DIR}/session-presets.json`;
const BASE = { dir: BaseDirectory.AppData };

// Load semua preset dari disk
export async function loadSessionPresets(): Promise<SessionPreset[]> {
    try {
        const fileExists = await exists(FILE, BASE);
        if (!fileExists) return [];
        const raw = await readTextFile(FILE, BASE);
        return JSON.parse(raw);
    } catch (error) {
        console.error("Gagal memuat session preset dari disk:", error);
        return [];
    }
}

async function persistPresets(presets: SessionPreset[]) {
    try {
        await createDir(DIR, { dir: BaseDirectory.AppData, recursive: true });
        await writeTextFile(FILE, JSON.stringify(presets), BASE);
    } catch (error) {
        console.error("Gagal menyimpan session preset ke disk:", error);
        throw error;
    }
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

    if (preset.items.length === 0) {
        const error = new Error("Session preset tidak punya file path yang bisa disimpan.");
        console.error(error.message, { itemCount: items.length });
        throw error;
    }

    const existing = await loadSessionPresets();
    await persistPresets([...existing, preset]);
    return preset;
}

// Restore items dari preset — convert path ke object URL
export async function restoreSessionPreset(
    preset: SessionPreset
): Promise<RestoredSessionItem[]> {
    return preset.items.map((item) => ({
        path: item.path,
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
    try {
        const existing = await loadSessionPresets();
        await persistPresets(existing.filter((p) => p.id !== id));
    } catch (error) {
        console.error("Gagal menghapus session preset:", error);
        throw error;
    }
}
