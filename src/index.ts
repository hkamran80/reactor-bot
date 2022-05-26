import dotenv from "dotenv";
import { Client, Intents } from "discord.js";
import {
    getGuildConfig,
    getUserConfig,
    removeUserConfig,
    updateConfig,
} from "./filesystem";
import {
    discordAnimatedCustomEmoteRegex,
    discordCustomEmoteRegex,
    emojiRegex,
    logger,
} from "./global";
import { bold } from "@discordjs/builders";

dotenv.config();

// TODO: Figure out why `isDebug` is `true`, even when the variable is absent
// const isDebug = process.env.DEBUG === "true";
const isDebug = false;
const debugPrefix = isDebug ? "[DEBUG] " : "";

// Create a new client instance
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

// When the client is ready, run this code (only once)
client.once("ready", () => {
    logger.info("Ready!");
});

client.login(process.env.DISCORD_TOKEN);

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.guild) {
        if (interaction.commandName === "add-reaction") {
            const user = interaction.options.getUser("user", true);
            const emoji = interaction.options.getString("emoji", true);

            if (isDebug) {
                logger.debug(`'${emoji}' for '${user}'`);
            }

            const emojiMatches = [
                emoji.match(emojiRegex) || [],
                emoji.match(discordCustomEmoteRegex) || [],
                emoji.match(discordAnimatedCustomEmoteRegex) || [],
            ].flat();

            if (emojiMatches) {
                await updateConfig(
                    interaction.guild.id,
                    user.id,
                    emojiMatches[0],
                );

                await interaction.reply({
                    content: `${debugPrefix}${user} will now have the ${emojiMatches[0]} emoji on all messages`,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: `${debugPrefix}Invalid emoji!`,
                    ephemeral: true,
                });
            }
        } else if (interaction.commandName === "remove-reaction") {
            const user = interaction.options.getUser("user", true);
            await removeUserConfig(interaction.guild.id, user.id);

            await interaction.reply({
                content: `${debugPrefix}Removed user emoji for ${user}`,
                ephemeral: true,
            });
        } else if (interaction.commandName === "list-reactions") {
            const guildConfig = await getGuildConfig(interaction.guild.id);
            if (guildConfig !== null) {
                const userEmojiMap = Object.entries(guildConfig)
                    .map(([userId, emoji]) => `${emoji} - <@${userId}>`)
                    .join("\n");

                await interaction.reply({
                    content:
                        debugPrefix +
                        bold(interaction.guild.name) +
                        " - " +
                        Object.keys(guildConfig).length +
                        "/" +
                        interaction.guild.memberCount +
                        " have reactions\n" +
                        userEmojiMap,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: `${debugPrefix}No reactions exist for ${interaction.guild.name}.`,
                    ephemeral: true,
                });
            }
        }
    }
});

client.on("messageCreate", async (message) => {
    if (message.guild) {
        if (!message.author.bot) {
            const userEmoji = await getUserConfig(
                message.guild.id,
                message.author.id,
            );

            if (userEmoji) {
                await message.react(userEmoji);
            }
        }
    }
});
