import { Router } from "express";
import { EcoleDirecteAPIError, Session, Student } from "ecoledirecte.js";
import { getTokenFromRefresh, getUserFromToken } from "../util/discord";
import { welcomeProtocol } from "../protocols/welcome";
import prisma from "../util/db";

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

	// Check if Discord user doesn't already exist in database
	const imposterA = await prisma.user.findUnique({
		where: { discordId: user.id },
	});
	if (imposterA)
		return res
			.status(400)
			.json({ message: "Ce compte Discord est déjà utilisé." });

	// Login to EcoleDirecte
	const s = new Session(body.username, body.password);
	const a = await s.login().catch((err: EcoleDirecteAPIError) => {
		//TODO Handle error
		res.status(400).json({ err });
		return;
	});
	if (!a) return;
	if (a.type !== "student")
		return res
			.status(400)
			.json({ message: "Seuls les élèves sont autorisés." });

	// Check if ED student isn't already used
	const imposterB = await prisma.user.findUnique({
		where: { id: a.edId },
	});
	if (imposterB)
		return res
			.status(400)
			.json({ message: "Ce compte EcoleDirecte est déjà utilisé." });

	// Is good
	const fullName = (a: Student) => `${a._raw.prenom} ${a._raw.nom}`;

	const pfp = await a.getPhoto();

	// Save user
	const created = await prisma.user.create({
		data: {
			id: a.edId,
			discordId: user.id,
			fullName: fullName(a),
			photo: pfp,
			class: a._raw.profile?.classe?.code ?? undefined,
		},
	});

	res.status(200).json({ user: created });

	// Welcome Protocol
	welcomeProtocol(user, a);
});

export default router;
export { router as loginRouter };
