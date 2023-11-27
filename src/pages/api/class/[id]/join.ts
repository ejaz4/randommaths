import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../libs/verify";
import { prisma } from "../../../../../libs/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") {
		const token = req.headers.authorization;

		// We are expecting the ID to be the classCode in this case.
		const classCode = req.query.id;

		// Check if token is provided
		if (!token) {
			return res.status(401).json({ message: "No token provided" });
		}

		// Verify token
		const verify = await verifyToken(token);

		// If token is invalid
		if (!verify.status || !verify.userId) {
			return res.status(401).json({ message: "Invalid token" });
		}

		// Get user
		const userCall = await prisma.user.findUnique({
			where: {
				id: verify.userId,
			},
			select: {
				class: true,
				type: true,
			},
		});

		// If user is not found
		if (!userCall) {
			return res.status(404).json({ message: "User not found" });
		}

		// If user is already in class
		if (userCall.class?.classCode == classCode) {
			return res.status(400).json({ message: "Already in class" });
		}

		// If user is a teacher
		if (userCall.type == "teacher") {
			return res
				.status(400)
				.json({ message: "Teachers cannot join classes" });
		}

		// Connect class
		const userConnect = await prisma.user
			.update({
				where: {
					id: verify.userId,
				},
				data: {
					class: {
						connect: {
							classCode: classCode as string,
						},
					},
				},
			})
			.catch((error) => {
				return res.status(400).json({ message: error.message });
			});

		// Send response
		return res.status(200).json({ success: true });
	}
}
