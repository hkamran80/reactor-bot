import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import type { Config } from "./types";

const FILENAME = "reactor.json";

const readConfig = async (): Promise<Config> => {
    if (existsSync(FILENAME)) {
        return JSON.parse((await readFile(FILENAME)).toString());
    } else {
        return {};
    }
};

export const getUserConfig = async (
    guildId: string,
    userId: string,
): Promise<string | null> => {
    const config = await readConfig();
    if (
        Object.keys(config).indexOf(guildId) !== -1 &&
        Object.keys(config[guildId]).indexOf(userId) !== -1
    ) {
        return config[guildId][userId];
    } else {
        return null;
    }
};

export const updateConfig = async (
    guildId: string,
    userId: string,
    emoji: string,
) => {
    const config = await readConfig();

    if (Object.keys(config).indexOf(guildId) === -1) {
        config[guildId] = {};
    }

    config[guildId][userId] = emoji;

    await writeFile(FILENAME, JSON.stringify(config));
};

export const removeUserConfig = async (
    guildId: string,
    userId: string,
): Promise<void> => {
    const config = await readConfig();
    if (
        Object.keys(config).indexOf(guildId) !== -1 &&
        Object.keys(config[guildId]).indexOf(userId) !== -1
    ) {
        delete config[guildId][userId];
        await writeFile(FILENAME, JSON.stringify(config));
    }
};
