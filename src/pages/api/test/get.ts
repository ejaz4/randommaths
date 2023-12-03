import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../libs/verify";
import { prisma } from "../../../../libs/prisma";

type GetRequestBody = {
	targetUserID?: string;
	classID?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") {
		// get the token
		const token = req.headers.authorization;

		// check if the token exists
		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		// verify the token
		const verify = await verifyToken(token);

		// check if the token is valid
		if (!verify.status) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		if (!verify.userId) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const { targetUserID, classID }: GetRequestBody = req.body;

		let userID = verify.userId;

		if (targetUserID) userID = targetUserID;

		if (classID) {
			const tests = await prisma.work.findMany({
				where: {
					userId: userID,
					sendTo: {
						id: classID,
					},
				},
				take: 30,
				orderBy: {
					updatedAt: "desc",
				},
			});

			return res.status(200).json({ tests });
		} else {
			const tests = await prisma.work.findMany({
				where: {
					userId: userID,
				},
				take: 30,
				orderBy: {
					updatedAt: "desc",
				},
			});

			return res.status(200).json({ tests });
		}
	}
}
