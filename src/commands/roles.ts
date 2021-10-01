import * as Discord from "discord.js";
import prisma from "../util/db";
import { env } from "../util/env";
import { Niveau, rolesNiveau } from "../util/roles";
import { InteractionHandler } from "../util/types";

export const rolesHandler: InteractionHandler = async (client, interaction) => {
	const subcommand = interaction.options.getSubcommand();
	const role = interaction.options.getRole("role") as Discord.Role;

	const doc = await prisma.user.findUnique({
		where: { discordId: interaction.user.id },
	});

	if (!role)
		return await interaction.reply({
			content: "Vous n'avez pas spécifié de rôle.",
			ephemeral: true,
		});

	const member =
		interaction.guild?.id === env("GUILD_ID")
			? (interaction.member as Discord.GuildMember)
			: (
					client.guilds.cache.get(env("GUILD_ID")) ||
					(await client.guilds.fetch(env("GUILD_ID")))
			  ).members.cache.get(interaction.user.id);

	if (!member) {
		return interaction.reply({
			content: "Nous ne vous avons pas trouvé.e dans le serveur Discord...",
			ephemeral: true,
		});
	}

	const hasRole = member.roles.cache.has(role.id);
	const mayBeMentor = doc?.class && ["3", "2", "1", "T"].includes(doc.class[0]);
	const mayBeMentored =
		doc?.class && ["6", "5", "4", "3"].includes(doc.class[0]);
	let success = false;

	if (subcommand === "add") {
		if (hasRole)
			return await interaction.reply({
				content: "Vous possédez déjà ce rôle.",
				ephemeral: true,
			});
		if (role.name === "OK") {
			return await interaction.reply({
				content: "Pour vous connecter, utilisez `/login`.",
				ephemeral: true,
			});
		}
		if (Object.values(rolesNiveau).includes(role.name)) {
			return await interaction.reply({
				content: "Ceci est un rôle spécial. Vous ne pouvez pas vous l'ajouter.",
				ephemeral: true,
			});
		}
		if (role.name === "Tuteur") {
			if (mayBeMentor) {
				success = true;
				await member.roles.add(role).catch(() => (success = false));
			} else {
				return await interaction.reply({
					content:
						"Les tuteurs doivent être en 3ème ou plus. Nous n'avons pas pu vérifier cela.",
					ephemeral: true,
				});
			}
		}

		if (role.name === "Sous tutelle") {
			if (mayBeMentored) {
				// Add mentored role
				success = true;
				await member.roles.add(role).catch(() => (success = false));
			} else {
				return await interaction.reply({
					content:
						"Les personnes sous tuelle doivent être en 3ème ou moins. Nous n'avons pas pu vérifier cela.",
					ephemeral: true,
				});
			}
		}

		return success
			? interaction.reply({
					content: "L'opération s'est déroulée sans accroc.",
					ephemeral: true,
			  })
			: interaction.reply({
					content: "On dirait que je ne peux pas vous donner ce rôle.",
					ephemeral: true,
			  });
	} else if (subcommand === "rem") {
		if (!hasRole)
			return await interaction.reply({
				content: "Vous ne possédez pas ce rôle.",
				ephemeral: true,
			});

		if (role.name === "OK") {
			return await interaction.reply({
				content: "Pour vous déconnecter, utilisez `/logout`.",
				ephemeral: true,
			});
		}

		if (doc?.class && rolesNiveau[doc.class[0] as Niveau] === role.name) {
			return await interaction.reply({
				content: "Vous ne pouvez pas enlever ce rôle.",
				ephemeral: true,
			});
		}

		if (role.name === "Tuteur") {
			success = true;
			await member.roles.remove(role).catch(() => (success = false));
		}

		if (role.name === "Sous tutelle") {
			success = true;
			await member.roles.remove(role).catch(() => (success = false));
		}

		return success
			? interaction.reply({
					content: "L'opération s'est déroulée sans accroc.",
					ephemeral: true,
			  })
			: interaction.reply({
					content: "On dirait que je ne peux pas vous enlever ce rôle.",
					ephemeral: true,
			  });
	}
};
