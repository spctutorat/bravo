import prisma from "../util/db";
import * as Discord from "discord.js";
import { InteractionHandler } from "../util/types";
import { rolesNiveau } from "../util/roles";

export const logoutHandler: InteractionHandler = async (
	client,
	interaction
) => {
	// Check if already logged in
	const doc = await prisma.user.findUnique({
		where: { discordId: interaction.user.id },
	});
	if (doc) {
		// Logged in
		// Ask for confirmation
		await interaction.deferReply();
		const reply = (await interaction.editReply(
			"Se déconnecter ?"
		)) as Discord.Message;
		const filter: Discord.CollectorFilter<
			[Discord.MessageReaction, Discord.User]
		> = (reaction, user) => {
			const a =
				(["✅", "❌"] as (string | null)[]).includes(reaction.emoji.name) &&
				user.id === interaction.user.id;
			return a;
		};
		reply
			.awaitReactions({ max: 1, filter, time: 10000, errors: ["time"] })
			.then(async collected => {
				const reaction = collected.first();
				if (reaction?.emoji.name === "✅") {
					// Validate
					await prisma.user.delete({
						where: { discordId: interaction.user.id },
					});
					// Remove roles
					const member = interaction.member as Discord.GuildMember;
					await member.fetch();
					const toDelete = member.roles.cache.filter(r =>
						["OK", ...Object.values(rolesNiveau)].includes(r.name)
					);
					member.roles.remove(toDelete);
					// Inform user
					await interaction.editReply(
						"_Compte supprimé. Vos données ont été supprimées._"
					);
				} else {
					// Cancel
					await interaction.editReply("_Déconnexion annulée._");
				}
			})
			.catch(async collected => {
				await interaction.editReply("_Aucune réaction : Déconnexion annulée._");
			});
		await reply.react("✅");
		await reply.react("❌");
	} else {
		// Logged out
		await interaction.reply({
			content:
				"Vous n'êtes pas identifié.e. Utilisez `/login` pour vous connecter.",
		});
	}
};
