// Triggered when ED & Discord access is given

import * as Discord from "discord.js";
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

	const member = guild.members.cache.get(env("GUILD_ID"));

	if (!member || !guild || !self || !user) return;

	const dm = await user.createDM();

	//! Renommer
	let failedRename = false;
	const name = `${student._raw.prenom} ${student._raw.nom.substr(0, 1)}`;
	if (self.permissions.has("MANAGE_NICKNAMES")) await member.setNickname(name);
	else failedRename = true;

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
		return;
	}

	const niveau = classe.code.substr(0, 1) as Niveau;
	const nomRole = rolesNiveau[niveau] as string | undefined;

	if (!nomRole) {
		// Log anomaly
		return;
	}

	const role =
		guild.roles.cache.find(r => r.name === nomRole) ||
		(await guild.roles.create({ name: nomRole }));

	await member.roles.add(role);

	//! Welcome message
	const message = `
		Bienvenue sur le serveur de tutorat pour SPC ! Vous avez été identifié.e avec succès. 
	`;

	const profile = new Discord.MessageEmbed()
		.setTitle(`${student._raw.prenom} ${student._raw.nom}`)
		.addField("Classe", classe.libelle)
		.addField("Niveau", nomRole);

	await dm.send({ content: message, embeds: [profile] });

	// Bienvenue ! Vous êtes maintenant connecté.e en tant que {nom}. Vous avez désormais accès à SPC-Tutorat.
	// Du fait de votre classe, les rôles suivants vous ont été attribués : Troisième, Lycée.
	// J'ai aussi remarqué que vous aviez des cours spéciaux : Vous êtes maintenant dans les groupes Allemand, et Latin.
	// Vous pouvez ajuster vos roles à tout moment avec /roles.
}
