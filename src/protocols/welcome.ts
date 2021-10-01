// Triggered when ED & Discord access is given

import Discord, { DiscordAPIError } from "discord.js";
import { APIUser } from "discord-api-types";
import { Student } from "ecoledirecte.js";
import client from "../bot";
import { env } from "../util/env";
import { Niveau, rolesNiveau } from "../util/roles";

export async function welcomeProtocol(doc: APIUser, student: Student) {
	const user =
		client.users.cache.get(doc.id) || (await client.users.fetch(doc.id));

	const guild =
		client.guilds.cache.get(env("GUILD_ID")) ||
		(await client.guilds.fetch(env("GUILD_ID")));

	const self = guild.me;

	const member =
		guild.members.cache.get(user.id) || (await guild.members.fetch(user.id));

	if (!member || !guild || !self || !user) return;

	const dm = await user.createDM();

	//! Renommer
	const name = `${student._raw.prenom} ${student._raw.nom.substr(0, 1)}`;
	try {
		await member.setNickname(name);
	} catch (err) {
		if (!(err instanceof DiscordAPIError)) {
			throw err;
		}
	}

	//! Ajouter rôle de clearance
	const clearanceRole =
		guild.roles.cache.find(r => r.name === "OK") ||
		(await guild.roles.create({ name: "OK" }));

	await member.roles.add(clearanceRole);

	//! Attribuer les rôles

	// Attribuer rôle de niveau
	const classe = student._raw.profile?.classe;

	if (!classe) {
		// Pas de classe disponible. Safe lock
		console.log("no class");
		return;
	}

	const niveau = classe.code.substr(0, 1) as Niveau;
	const nomRole = rolesNiveau[niveau] as string | undefined;

	if (!nomRole) {
		// Log anomaly
		console.log("no level");
		return;
	}

	const role =
		guild.roles.cache.find(r => r.name === nomRole) ||
		(await guild.roles.create({ name: nomRole }));

	await member.roles.add(role);

	//! Welcome message
	const message =
		"Bienvenue sur le serveur de tutorat pour SPC ! Vous avez été identifié.e avec succès. Les rôles vous correspondant ont été automatiquement ajoutés. " +
		"Vous pouvez voir votre profil et celui des autres avec `/id` à tout moment sur le serveur. " +
		"Pour plus d'informations, essayez `/info`.";

	await dm.send({ content: message });
	// await dm.messages.fetch();
	// dm.messages.cache.map(m => m.deletable && m.delete());
}
