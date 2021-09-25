// Triggered when ED & Discord access is given

import { APIUser } from "discord-api-types";
import client from "../bot";

export async function welcomeProtocol(doc: APIUser) {
	const user =
		client.users.cache.get(doc.id) || (await client.users.fetch(doc.id));

	const channel = await user.createDM();
	channel.send("Hello");
}
