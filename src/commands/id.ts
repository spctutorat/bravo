import * as Discord from "discord.js";
import { InteractionHandler } from "../util/types";

export const idHandler: InteractionHandler = async (client, interaction) => {
	const embed = new Discord.MessageEmbed().setDescription("Hello");
	await interaction.reply({
		content: "Pong!",
		ephemeral: true,
		embeds: [embed],
	});
};
