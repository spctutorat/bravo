import {
	SlashCommandBuilder,
	SlashCommandSubcommandBuilder,
} from "@discordjs/builders";

export const commands = [
	new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),
	new SlashCommandBuilder()
		.setName("id")
		.setDescription("Gestion de l'identité")
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("profile")
				.setDescription("Vérifiez vos informations")
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("clean")
				.setDescription("Supprime les données liées à votre compte")
		),
].map(command => command.toJSON());
