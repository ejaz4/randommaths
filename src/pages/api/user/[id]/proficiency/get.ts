import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../../libs/verify";
import { prisma } from "../../../../../../libs/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const token = req.headers.authorization;
	let userId = req.query.id;

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

	// If the user ID is set to @me, just autofill the current user's ID.
	if (userId == "@me") {
		userId = verify.userId;
	}

	if (req.method == "POST") {
		// Get the user's proficiency
		const subTopics = req.body as string[];

		const proficiency = await prisma.proficiency
			.findMany({
				where: {
					userId: userId as string,
					OR: [
						{
							id: {
								in: subTopics,
							},
						},
					],
				},
				select: {
					id: true,
					userId: true,
					level: true,
				},
			})
			.catch((error) => {
				return res.status(400).json({ message: "Invalid body" });
			});

		if (!proficiency) {
			return res.status(400).json({ message: "Not working." });
		}

		// Pad the remaining subtopics with 0
		const subTopicIds = proficiency.map((subTopic) => subTopic.id);

		const remainingSubTopics = subTopics.filter(
			(subTopic: string) => !subTopicIds.includes(subTopic)
		);

		// Pad the remaining subtopics with 0
		const remainingProficiency = remainingSubTopics.map(
			(subTopic: string) => {
				return {
					id: subTopic,
					userId: userId,
					level: 0,
				};
			}
		);

		// Add the remaining subtopics to the proficiency
		const newProficiency = [...proficiency, ...remainingProficiency];

		// Return the proficiency
		return res.status(200).json(newProficiency);
	}
}
