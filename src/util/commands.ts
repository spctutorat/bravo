import {
	SlashCommandBuilder,
	SlashCommandRoleOption,
	SlashCommandSubcommandBuilder,
	SlashCommandUserOption,
} from "@discordjs/builders";

export const commands = [
	new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Replies with Pong!"),

	new SlashCommandBuilder()
		.setName("roles")
		.setDescription("Gérez vos rôles")
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("add")
				.setDescription("Ajoutez un rôle")
				.addRoleOption(
					new SlashCommandRoleOption()
						.setName("role")
						.setDescription("Rôle à ajouter")
						.setRequired(true)
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("rem")
				.setDescription("Supprimez un rôle")
				.addRoleOption(
					new SlashCommandRoleOption()
						.setName("role")
						.setDescription("Rôle à supprimer")
						.setRequired(true)
				)
		),

	new SlashCommandBuilder()
		.setName("id")
		.setDescription("Gestion de l'identité")
		.addUserOption(
			new SlashCommandUserOption()
				.setName("personne")
				.setDescription("Personne à identifier")
				.setRequired(false)
		),
].map(command => command.toJSON());
