import prisma from "../util/db";
import * as Discord from "discord.js";
import { InteractionHandler } from "../util/types";

export const idHandler: InteractionHandler = async (client, interaction) => {
	const targetOption = interaction.options.getUser("personne");
	// await interaction.deferReply({ ephemeral: true });
	const target = targetOption || interaction.user;

	const doc = await prisma.user.findUnique({
		where: { discordId: target.id },
	});
	if (!doc) {
		await interaction.reply({
			content: `L'utilisateur <@${target.id}> n'a pas prouvé son identité.`,
			ephemeral: true,
		});
		return;
	}

	const pfp = doc.photo;

	const embed = new Discord.MessageEmbed()
		.setAuthor(target.username, target.avatarURL() || undefined)
		.setTitle(doc.fullName)
		.setThumbnail("attachment://pfp.jpg")
		.addField("Classe", doc.class ?? "Inconnue");

	const maySeePhoto =
		interaction.user.id === doc.discordId || doc.publicPhoto !== false;

	const attachment =
		pfp && maySeePhoto
			? new Discord.MessageAttachment(pfp, "pfp.jpg")
			: undefined;

	await interaction.reply({
		embeds: [embed],
		files: attachment ? [attachment] : undefined,
		ephemeral: true,
	});
};
