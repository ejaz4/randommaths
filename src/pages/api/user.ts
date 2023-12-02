import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../libs/prisma";
import { verifyToken } from "../../../libs/verify";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "GET") {
		const token = req.headers.authorization;

		if (!token) {
			res.status(400).json({ message: "Missing authorization header" });
			return;
		}

		const verification = await verifyToken(token);

		if (verification.status) {
			const user = await prisma.user.findUnique({
				where: {
					id: verification.userId as string,
				},
				select: {
					id: true,
					name: true,
					email: true,
					type: true,
					class: {
						select: {
							name: true,
							id: true,
						},
					},
					ClassAndOwner: {
						select: {
							class: {
								select: {
									name: true,
									id: true,
								},
							},
						},
					},
				},
			});

			res.status(200).json({ user });
		} else {
			res.status(400).json({ message: "Invalid token" });
		}
	}
}
