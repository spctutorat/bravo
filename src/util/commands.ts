import {
	SlashCommandBuilder,
	SlashCommandUserOption,
} from "@discordjs/builders";

export const commands = [
	new SlashCommandBuilder()
		.setName("id")
		.setDescription("Gestion de l'identité")
		.addUserOption(
			new SlashCommandUserOption()
				.setName("personne")
				.setDescription("Personne à identifier")
				.setRequired(false)
		),

	new SlashCommandBuilder()
		.setName("login")
		.setDescription("Prouvez votre identité"),

	new SlashCommandBuilder()
		.setName("logout")
		.setDescription("Déconnectez-vous"),
].map(command => command.toJSON());
