import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import type { Config } from "./types";

const FILENAME = "reactor.json";

/**
 * Read the user config file if it exists, otherwise return an empty dicctionary
 * @returns {Promise<Config>} The config object
 */
const readConfig = async (): Promise<Config> => {
    if (existsSync(FILENAME)) {
        return JSON.parse((await readFile(FILENAME)).toString());
    } else {
        return {};
    }
};

/**
 * Get a emoji for a user in a guild
 * @param {string} guildId The ID of the guild
 * @param {string} userId The ID of the user to fetch
 * @returns {Promise<string | null>} The emoji if set, otherwise `null`
 */
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

/**
 * Update the config with an emoji for a specific user in a specific guild
 * @param {string} guildId The ID of the guild to update
 * @param {string} userId The ID of the user to update
 * @param {string} emoji The emoji string
 */
export const updateConfig = async (
    guildId: string,
    userId: string,
    emoji: string,
): Promise<void> => {
    const config = await readConfig();

    if (Object.keys(config).indexOf(guildId) === -1) {
        config[guildId] = {};
    }

    config[guildId][userId] = emoji;

    await writeFile(FILENAME, JSON.stringify(config));
};

/**
 * Remove a user from a specific guild's config
 * @param {string} guildId The ID of the guild that the user exists in
 * @param {string} userId The ID of the user to remove a config object for
 */
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
