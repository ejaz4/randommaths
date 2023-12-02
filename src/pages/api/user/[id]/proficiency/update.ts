import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../../libs/verify";
import { prisma } from "../../../../../../libs/prisma";

type ProficiencySetBody = {
	subTopicId: string;
	increase: boolean;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") {
		// Get the token
		const token = req.headers.authorization;

		// Check if token is provided
		if (!token) {
			return res.status(403).json({ message: "No token provided" });
		}

		// Verify the token
		const verify = await verifyToken(token);

		// Check if token is valid
		if (!verify.status) {
			return res.status(403).json({ message: "Invalid token." });
		}

		if (!verify.userId) {
			return res.status(403).json({ message: "Invalid token." });
		}

		// Get the body
		const { subTopicId, increase } = req.body as ProficiencySetBody;

		// Check if body is valid
		if (!subTopicId || typeof increase !== "boolean") {
			return res.status(400).json({ message: "Invalid body" });
		}

		// Check if the subtopic exists in the user's personal proficiency list.
		let check = await prisma.proficiency.findFirst({
			where: {
				userId: verify.userId,
				id: subTopicId,
			},
			select: {
				level: true,
				gradient: true,
				genId: true,
			},
		});

		if (!check) {
			check = await prisma.proficiency.create({
				data: {
					userId: verify.userId,
					id: subTopicId,
					level: increase ? 1 : 0,
					gradient: 1,
				},
			});
		}

		// Now update the record
		if (increase == true) {
			// Increase the gradient and the level.
			const updateRecord = await prisma.proficiency.update({
				where: {
					userId: verify.userId,
					id: subTopicId,
					genId: check.genId,
				},
				data: {
					level: check.level + check.gradient,
					gradient: check.gradient + 1,
				},
			});
		} else {
			// Drop the gradient back down.
			const updateRecord = await prisma.proficiency.update({
				where: {
					userId: verify.userId,
					id: subTopicId,
					genId: check.genId,
				},
				data: {
					gradient: 1,
				},
			});
		}

		return res.status(200).json({ message: "Success" });
	}
}
