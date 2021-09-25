import { Router } from "express";
import client from "../bot";
import { getTokenFromRefresh, getUserFromToken } from "../util/discord";

const router = Router();

router.use("/", async (req, res) => {
	const body = req.body as {
		username: string;
		password: string;
		code: string;
		token: string;
	};
	// const channel = client.channels.cache.get("886707789014114336");
	// if (channel?.isText()) {
	// 	channel.send(
	// 		"Login fetched. ```" + JSON.stringify(req.body, null, 4) + "```"
	// 	);
	// }
	const token = await getTokenFromRefresh(body.token).catch(err => undefined);
	if (!token) return res.status(400).send("wrong token");
	const user = await getUserFromToken(token.access_token).catch(
		err => undefined
	);
	// if (user) console.log({ user });
	res.send(user || "nope");
});

export default router;
export { router as loginRouter };
