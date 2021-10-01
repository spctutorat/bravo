import prisma from "../util/db";
import * as Discord from "discord.js";
import { InteractionHandler } from "../util/types";

export const loginHandler: InteractionHandler = async (client, interaction) => {
	// Check if already logged in
	const doc = await prisma.user.findUnique({
		where: { discordId: interaction.user.id },
	});

	if (doc) {
		await interaction.reply({
			content: `Vous êtes déjà connecté.e en tant que : \`${
				doc.fullName
			}\` depuis le \`${doc.createdAt.toDateString()}\`. Pour voir votre profil, faites \`/id\`. Pour vous déconnecter, utilisez \`/logout\``,
			ephemeral: true,
		});
	} else {
		// Send guide on how to login
		const embed = new Discord.MessageEmbed()
			.setTitle("Se connecter")
			.setURL("http://localhost:3000/")
			.setDescription("Vous connecter vous permet de prouver votre identité.");

		await interaction.reply({ embeds: [embed], ephemeral: true });
	}
};
