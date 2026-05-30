import { createDir, writeTextFile, readTextFile, exists } from "@tauri-apps/api/fs";
import { BaseDirectory } from "@tauri-apps/api/path";
import { convertFileSrc } from "@tauri-apps/api/tauri";
import { MediaItem, RestoredSessionItem, SessionPreset, Preset } from "./types";

const DIR = "presets";
const FILE = `${DIR}/session-presets.json`;
const LAYOUT_FILE = `${DIR}/layout-presets.json`;
const BASE = { dir: BaseDirectory.AppData };
// Load all session presets from disk.
export async function loadSessionPresets(): Promise<SessionPreset[]> {
    try {
        const fileExists = await exists(FILE, BASE);
        if (!fileExists) return [];
        const raw = await readTextFile(FILE, BASE);
        return JSON.parse(raw);
    } catch (error) {
        console.error("Failed to load session presets from disk:", error);
        return [];
    }
}

async function persistPresets(presets: SessionPreset[]) {
    try {
        await createDir(DIR, { dir: BaseDirectory.AppData, recursive: true });
        await writeTextFile(FILE, JSON.stringify(presets), BASE);
    } catch (error) {
        console.error("Failed to save session presets to disk:", error);
        throw error;
    }
}

// Save a new session preset from the current item state.
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
        const error = new Error("Session preset has no file paths that can be saved.");
        console.error(error.message, { itemCount: items.length });
        throw error;
    }

    const existing = await loadSessionPresets();
    await persistPresets([...existing, preset]);
    return preset;
}

// Restore items from a preset and convert file paths to object URLs.
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

// Delete a session preset by id.
export async function deleteSessionPreset(id: string): Promise<void> {
    try {
        const existing = await loadSessionPresets();
        await persistPresets(existing.filter((p) => p.id !== id));
    } catch (error) {
        console.error("Failed to delete session preset:", error);
        throw error;
    }
}

// Load all layout presets from disk, or localStorage in the browser.
export async function loadLayoutPresets(): Promise<Preset[]> {
    const isTauri = !!(window as any).__TAURI__;
    if (!isTauri) {
        const saved = localStorage.getItem("multiplayer-presets");
        return saved ? JSON.parse(saved) : [];
    }
    try {
        const fileExists = await exists(LAYOUT_FILE, BASE);
        if (!fileExists) return [];
        const raw = await readTextFile(LAYOUT_FILE, BASE);
        return JSON.parse(raw);
    } catch (error) {
        console.error("Failed to load layout presets from disk:", error);
        return [];
    }
}

// Persist layout presets to disk or localStorage.
async function persistLayoutPresets(presets: Preset[]) {
    const isTauri = !!(window as any).__TAURI__;
    if (!isTauri) {
        localStorage.setItem("multiplayer-presets", JSON.stringify(presets));
        return;
    }
    try {
        await createDir(DIR, { dir: BaseDirectory.AppData, recursive: true });
        await writeTextFile(LAYOUT_FILE, JSON.stringify(presets), BASE);
    } catch (error) {
        console.error("Failed to save layout presets to disk:", error);
        throw error;
    }
}

// Save a new layout preset.
export async function saveLayoutPreset(
    name: string,
    items: MediaItem[]
): Promise<Preset> {
    const preset: Preset = {
        id: crypto.randomUUID(),
        name,
        layout: items.map(({ id, x, y, width, height }) => ({ id, x, y, width, height })),
        createdAt: Date.now(),
    };

    const existing = await loadLayoutPresets();
    await persistLayoutPresets([...existing, preset]);
    return preset;
}

// Delete a layout preset by id.
export async function deleteLayoutPreset(id: string): Promise<void> {
    try {
        const existing = await loadLayoutPresets();
        await persistLayoutPresets(existing.filter((p) => p.id !== id));
    } catch (error) {
        console.error("Failed to delete layout preset:", error);
        throw error;
    }
}
