import Discord, { Intents } from "discord.js";
import { idHandler } from "./commands/id";
import { loginHandler } from "./commands/login";
import { logoutHandler } from "./commands/logout";
import { pingHandler } from "./commands/ping";
import { rolesHandler } from "./commands/roles";
import { env } from "./util/env";
import { registerInteractions } from "./util/registerInteractions";
import { initRoles } from "./util/roles";

const client = new Discord.Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
	],
	partials: ["MESSAGE", "CHANNEL", "REACTION"],
});

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

	if (interaction.commandName === "login") {
		loginHandler(client, interaction);
		return;
	}

	if (interaction.commandName === "logout") {
		logoutHandler(client, interaction);
		return;
	}

	if (interaction.commandName === "id") {
		idHandler(client, interaction);
		return;
	}
});

client.login(env("DISCORD_TOKEN"));

export default client;
