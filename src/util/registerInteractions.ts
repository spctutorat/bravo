import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { env } from "./env";

const commands: { name: string; description: string }[] = [
	new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
].map(command => command.toJSON());

const rest = new REST({ version: "9" }).setToken(env("DISCORD_TOKEN"));

export async function registerInteractions(): Promise<void> {
	await rest.put(
		Routes.applicationGuildCommands(env("DISCORD_ID"), env("GUILD_ID")),
		{
			body: commands,
		}
	);

	console.log("Successfully reloaded application (/) commands.");
}
