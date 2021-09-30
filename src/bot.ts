import Discord, { Intents } from "discord.js";
import { idHandler } from "./commands/id";
import { infoHandler } from "./commands/info";
import { loginHandler } from "./commands/login";
import { logoutHandler } from "./commands/logout";
import { pingHandler } from "./commands/ping";
import { preferencesHandler } from "./commands/preferences";
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

	switch (interaction.commandName) {
		case "ping": {
			pingHandler(client, interaction);
			break;
		}
		case "login": {
			loginHandler(client, interaction);
			break;
		}
		case "logout": {
			logoutHandler(client, interaction);
			break;
		}
		case "id": {
			idHandler(client, interaction);
			break;
		}
		case "info": {
			infoHandler(client, interaction);
			break;
		}
		case "preferences": {
			preferencesHandler(client, interaction);
			break;
		}
	}
});

client.login(env("DISCORD_TOKEN"));

export default client;
