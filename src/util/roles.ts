// List all roles

import { Guild } from "discord.js";

export type Niveau = "6" | "5" | "4" | "3" | "2" | "1" | "T";

export const rolesNiveau: Record<Niveau, string> = {
	"6": "Sixième",
	"5": "Cinquième",
	"4": "Quatrième",
	"3": "Troisième",
	"2": "Seconde",
	"1": "Première",
	T: "Terminale",
};

export async function initRoles(guild: Guild): Promise<void> {
	const roleNames = ["OK", ...Object.values(rolesNiveau)];
	await guild.roles.fetch();
	await Promise.all(
		roleNames.map(async n => {
			const existing = guild.roles.cache.find(f => f.name === n);
			if (!existing)
				await guild.roles.create({ name: n, reason: "Initiating roles" });
		})
	);
}
