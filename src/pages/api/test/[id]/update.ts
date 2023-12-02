import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../libs/verify";
import { prisma } from "../../../../../libs/prisma";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") {
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

		// Update the test with the new data
		const body = req.body;

		// Update
		const newTest = await prisma.work.update({
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
			data: {
				...body,
			},
		}).catch((error) => {
            return res.status(400).json({ message: "Invalid body" });
        });

        // Return the new test
        if (!newTest) return res.status(400).json({ message: "Invalid body" });
        
        return res.status(200).json(newTest);
	}
}
