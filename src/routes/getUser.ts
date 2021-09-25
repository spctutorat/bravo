import { Router } from "express";
import { getTokenFromCode, getUserFromToken } from "../util/discord";

const router = Router();

router.get("/", async (req, res) => {
	try {
		const token = await getTokenFromCode(req.query["code"] as string);
		const user = await getUserFromToken(token.access_token);
		res.send({ token, user });
	} catch (err) {
		res.status(400).send();
	}
});

export default router;
export { router as getUserRouter };
