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

	const targetUsername = target.username + "#" + target.discriminator;

	if (!doc) {
		await interaction.reply({
			content: `L'utilisateur \`${targetUsername}\` n'a pas prouvé son identité.`,
			ephemeral: true,
		});
		return;
	}

	const pfp = doc.photo;

	const embed = new Discord.MessageEmbed()
		.setAuthor(targetUsername, target.avatarURL() || undefined)
		.setTitle(doc.fullName)
		.setThumbnail("attachment://pfp.jpg")
		.addField("Classe", doc.class ?? "Inconnue");

	const attachment = pfp
		? new Discord.MessageAttachment(pfp, "pfp.jpg")
		: undefined;

	await interaction.reply({
		embeds: [embed],
		files: attachment ? [attachment] : undefined,
		ephemeral: true,
	});
};
