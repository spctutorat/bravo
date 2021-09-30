// Adds and removes optional roles, based on permissions
import * as Discord from "discord.js";
import { InteractionHandler } from "../util/types";

export const rolesHandler: InteractionHandler = async (client, interaction) => {
	const subcommand = interaction.options.getSubcommand();
	if (subcommand === "add") {
		interaction.reply("add");
	} else if (subcommand === "rem") {
		interaction.reply("remove");
	}
};
