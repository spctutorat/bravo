import { Client, CommandInteraction } from "discord.js";

export type LiteralUnion<T extends U, U = string> =
	| T
	| (U & Record<never, never>);

export type InteractionHandler = (
	client: Client,
	interaction: CommandInteraction
) => unknown;
