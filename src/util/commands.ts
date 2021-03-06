import {
	SlashCommandBooleanOption,
	SlashCommandBuilder,
	SlashCommandRoleOption,
	SlashCommandSubcommandBuilder,
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

	new SlashCommandBuilder()
		.setName("info")
		.setDescription("Plus d'information sur ce robot"),

	new SlashCommandBuilder()
		.setName("preferences")
		.setDescription("Réglez les paramètres")
		.addBooleanOption(
			new SlashCommandBooleanOption()
				.setName("photo-publique")
				.setDescription("Pouvons-nous montrer votre visage aux autres ?")
				.setRequired(false)
		),

	new SlashCommandBuilder()
		.setName("roles")
		.setDescription("Choisissez vos rôles")
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("add")
				.setDescription("Ajoutez un rôle")
				.addRoleOption(
					new SlashCommandRoleOption()
						.setName("role")
						.setDescription("Rôle à ajouter")
				)
		)
		.addSubcommand(
			new SlashCommandSubcommandBuilder()
				.setName("rem")
				.setDescription("Supprimez un rôle")
				.addRoleOption(
					new SlashCommandRoleOption()
						.setName("role")
						.setDescription("Rôle à enlever")
				)
		),
].map(command => command.toJSON());
