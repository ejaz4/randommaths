import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../libs/verify";
import { prisma } from "../../../../../libs/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "GET") {
		// Get the token to identify the user
		const token = req.headers.authorization;

		// Check if the token is actually there.
		if (!token) {
			return res.status(400).json({ message: "No token provided" });
		}

		const verify = await verifyToken(token);

		// Check if the token is valid

		if (!verify.status) {
			return res.status(400).json({ message: "Invalid token" });
		}

		if (!verify.userId) {
			return res.status(400).json({ message: "Invalid token" });
		}

		// Get the test id
		const testId = req.query.id;

		// Find the test
		const testCall = await prisma.work.findUnique({
			where: {
				id: testId as string,
				OR: [
					{ userId: verify.userId },
					{
						sendTo: {
							classAndOwner: {
								teacherId: verify.userId,
							},
						},
					},
				],
			},
			select: {
				id: true,
				title: true,
				questionMax: true,
				questionsCorrect: true,
				currentQuestion: true,
				status: true,
				startTime: true,
				endTime: true,
				onBreak: true,
				reviewAfter: true,
				breaksAllowed: true,
				cheating: true,
				subTopics: true,
				updatedAt: true,
				duration: true,
			},
		});

		// Check if the test exists
		if (!testCall) {
			return res.status(400).json({ message: "Test does not exist" });
		}

		return res.status(200).json(testCall);
	}
}
