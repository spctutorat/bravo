import { Router } from "express";
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

	const token = await getTokenFromRefresh(body.token).catch(err => undefined);
	if (!token) return res.status(400).send();
	const user = await getUserFromToken(token.access_token).catch(
		err => undefined
	);
	if (!user) return res.status(400).send();

	res.status(200).send(user);

	// Welcome Protocol
	welcomeProtocol(user);
});

export default router;
export { router as loginRouter };
