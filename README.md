# [Reactor](https://hkamran.com/showcase/reactor)
React to messages from specific users with specific emojis

## Usage
[Add to your servers](https://go.hkamran.com/add-reactor)

### Commands
- `/add-reaction`: Adds a reaction for any user
  - Requires: user, emoji
- `/remove-reaction`: Remove reactions from any user
  - Requires: user

## Building
Before running the bot, you must first install all of its dependencies (`pnpm install`) and configure the bot with environment variables. These environment variables should be stored in a `.env` file. Rename the `.env.sample` file to `.env` and follow the instructions below on how to generate the values for each key.

- `DISCORD_TOKEN`: Generate the bot token by following [this guide on the Discord.js website](https://discordjs.guide/preparations/setting-up-a-bot-application.html)
- `DISCORD_CLIENT_ID`: Your bot's client ID
  - Go to the Discord Developer Portal, select your bot, go to "General Information", then copy the value for "Application ID"
- `DISCORD_GUILD_ID`: Only used to deploy commands to a specific server/guild, instead of all
  - [Copy the ID](https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID) of a server/guild
  - If you would like to publish the commands to a single server, call the npm script `register` (assuming you are in the root directory)
  - If you would like to publish to all servers (the commands won't be available unless the bot is installed), call the npm script `register:global` (assuming you are in the root directory)

To run the bot, either first call `pnpm build`, open the directory (e.g. with `cd`), then call `node --es-module-specifier-resolution=node index.js`, or call `pnpm start`.