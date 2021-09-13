import { Router } from "express";
import client from "../bot";

const router = Router();

router.use("/", (req, res) => {
	const channel = client.channels.cache.get("886707789014114336");
	if (channel?.isText()) {
		channel.send("Login fetched.");
	}
	res.send("Message sent");
});

export default router;
export { router as loginRouter };
