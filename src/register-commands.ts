import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import dotenv from "dotenv";

dotenv.config();

const commands = [
    new SlashCommandBuilder()
        .setName("add-reaction")
        .setDescription("Add a reaction event")
        .addUserOption((option) =>
            option
                .setName("user")
                .setRequired(true)
                .setDescription("The user to react to"),
        )
        .addStringOption((option) =>
            option
                .setName("emoji")
                .setRequired(true)
                .setDescription("The emoji to react with"),
        ),
    new SlashCommandBuilder()
        .setName("remove-reaction")
        .setDescription("Remove a reaction event from someone")
        .addUserOption((option) =>
            option
                .setName("user")
                .setRequired(true)
                .setDescription("The user to not react to"),
        ),
];

const rest = new REST({ version: "9" }).setToken(
    process.env.DISCORD_TOKEN as string,
);

const isGlobalRegistration = process.argv.indexOf("--global") !== -1;

rest.put(
    isGlobalRegistration
        ? // If "--global"
          Routes.applicationCommands(process.env.DISCORD_CLIENT_ID as string)
        : // Else
          Routes.applicationGuildCommands(
              process.env.DISCORD_CLIENT_ID as string,
              process.env.DISCORD_GUILD_ID as string,
          ),
    { body: commands },
)
    .then(() =>
        console.log(
            `Successfully registered ${
                isGlobalRegistration ? "global" : ""
            } application commands`,
        ),
    )
    .catch(console.error);
