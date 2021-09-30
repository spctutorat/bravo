import Discord, { Intents } from "discord.js";
import { pingHandler } from "./commands/ping";
import { env } from "./util/env";
import { registerInteractions } from "./util/registerInteractions";
import { initRoles } from "./util/roles";

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS] });

// Discord bot
client.on("ready", async () => {
	await registerInteractions();
	const guild =
		client.guilds.cache.get(env("GUILD_ID")) ||
		(await client.guilds.fetch(env("GUILD_ID")));
	await initRoles(guild);
	console.log(`Logged in as ${client.user?.tag}!`);
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === "ping") {
		pingHandler(client, interaction);
		return;
	}
});

client.login(env("DISCORD_TOKEN"));

export default client;
