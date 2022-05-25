import dotenv from "dotenv";
import emojiRegex from "emoji-regex";
import { Client, Intents } from "discord.js";
import { getUserConfig, removeUserConfig, updateConfig } from "./filesystem";

dotenv.config();

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
    console.log("Ready!");
});

client.login(process.env.DISCORD_TOKEN);

client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.guild) {
        if (interaction.commandName === "add-reaction") {
            const user = interaction.options.getUser("user", true);
            const emoji = interaction.options.getString("emoji", true);

            // TODO: Add support for Discord-only emojis (e.g. the :regional_indicator_*:) and server-specific emojis
            const emojiMatch = emoji.match(emojiRegex());
            if (emojiMatch) {
                await updateConfig(
                    interaction.guild.id,
                    user.id,
                    emojiMatch[0],
                );

                await interaction.reply({
                    content: `${user} will now have the ${emojiMatch[0]} emoji on all messages`,
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "Invalid emoji!",
                    ephemeral: true,
                });
            }
        } else if (interaction.commandName === "remove-reaction") {
            const user = interaction.options.getUser("user", true);
            await removeUserConfig(interaction.guild.id, user.id);

            await interaction.reply({
                content: `Removed user emoji for ${user}`,
                ephemeral: true,
            });
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
