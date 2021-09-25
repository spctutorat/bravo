// Triggered when ED & Discord access is given

import { APIUser } from "discord-api-types";
import { Student } from "ecoledirecte.js";
import client from "../bot";

export async function welcomeProtocol(doc: APIUser, student: Student) {
	const user =
		client.users.cache.get(doc.id) || (await client.users.fetch(doc.id));

	const channel = await user.createDM();
	// Bienvenue ! Vous êtes maintenant connecté.e en tant que {nom}. Vous avez désormais accès à SPC-Tutorat.
	// Du fait de votre classe, les rôles suivants vous ont été attribués : Troisième, Lycée.
	// J'ai aussi remarqué que vous aviez des cours spéciaux : Vous êtes maintenant dans les groupes Allemand, et Latin.
	// Vous pouvez ajuster vos roles à tout moment avec /roles.
}
