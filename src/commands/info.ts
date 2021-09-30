import * as Discord from "discord.js";
import { InteractionHandler } from "../util/types";

export const infoHandler: InteractionHandler = async (client, interaction) => {
	const embed = new Discord.MessageEmbed()
		.setAuthor("Information", client.user?.avatarURL() || undefined)
		.setTitle("Bravo")
		.setDescription(
			"Bravo est le bot Discord d'authentification par EcoleDirecte. Sa mission ? Vérifier votre identité afin de faire le pont entre Discord et la vraie vie."
		)
		.setThumbnail(client.user?.avatarURL() || "")
		.addField(
			"Données stockées",
			"Les données suivantes sont stockées : ID EcoleDirecte (ex: 1234), Nom complet (ex: Harry Potter), Code de classe (ex: 4T3) et Photo de profil."
		)
		.addField(
			"Supprimer les données",
			"Vous pouvez supprimer vos données grâce à la commande `/logout`."
		)
		.addField(
			"Confiance",
			"Pas besoin de faire confiance, vous pouvez vérifier. Le code est open source. Vous pouvez trouver [le code du bot ici](https://github.com/spctutorat/bravo) et celui du [site Web ici](https://github.com/spctutorat/bravo-web)."
		);
	await interaction.reply({
		ephemeral: true,
		embeds: [embed],
	});
};
