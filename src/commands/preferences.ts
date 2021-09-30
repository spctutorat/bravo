import prisma from "../util/db";
import * as Discord from "discord.js";
import { InteractionHandler } from "../util/types";

export const preferencesHandler: InteractionHandler = async (
	client,
	interaction
) => {
	await interaction.deferReply({ ephemeral: true });
	const options = interaction.options;

	const doc = await prisma.user.findUnique({
		where: { discordId: interaction.user.id },
	});

	if (!doc) {
		return await interaction.editReply(
			"Vous n'êtes pas connecté.e. Pour vous connecter, utilisez `/login`"
		);
	}

	const publicAvatar = options.getBoolean("photo-publique");
	if (publicAvatar !== null) {
		await prisma.user.update({
			where: { discordId: interaction.user.id },
			data: { publicPhoto: publicAvatar },
		});
	}
	await interaction.editReply({
		content: "Les paramètres que vous avez mentionnés ont été appliqués.",
	});
};
