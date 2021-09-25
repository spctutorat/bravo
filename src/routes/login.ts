import { Router } from "express";
import { EcoleDirecteAPIError, Session } from "ecoledirecte.js";
import { getTokenFromRefresh, getUserFromToken } from "../util/discord";
import { welcomeProtocol } from "../protocols/welcome";

const router = Router();

router.use("/", async (req, res) => {
	const body = req.body as {
		username: string;
		password: string;
		code: string;
		token: string;
	};

	const token = await getTokenFromRefresh(body.token).catch(() => undefined);
	if (!token) return res.status(400).send();
	const user = await getUserFromToken(token.access_token).catch(
		() => undefined
	);
	if (!user) return res.status(400).send();

	//TODO Check if Discord user doesn't already exist in database

	//TODO Check EcoleDirecte
	const s = new Session(body.username, body.password);
	const a = await s.login().catch((err: EcoleDirecteAPIError) => {
		//TODO Handle error
		return;
	});
	if (!a) return;
	if (a.type !== "student")
		return res
			.status(400)
			.json({ message: "Seuls les élèves sont autorisés." });

	//TODO Check if ED student isn't already used

	// Is good

	//TODO Save user

	res.status(200).send(user);

	// Welcome Protocol
	welcomeProtocol(user);
});

export default router;
export { router as loginRouter };
