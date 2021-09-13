import Discord, { Intents } from "discord.js";
import { env } from "./util/env";
import { registerInteractions } from "./util/registerInteractions";

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });

// Discord bot
client.on("ready", async () => {
	await registerInteractions();
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === "ping") {
		await interaction.reply("Pong!");
	}
});

client.login(env("DISCORD_TOKEN"));
