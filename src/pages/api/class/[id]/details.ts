import { request } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../../libs/verify";
import { prisma } from "../../../../../libs/prisma";
import { useRouter } from "next/router";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "GET") {
		const token = req.headers.authorization;

		if (!token) {
			return res.status(401).json({ message: "No token provided" });
		}

		const id = req.query.id;

		const verified = await verifyToken(token);

		if (!verified.status) {
			return res.status(401).json({ message: "Invalid token" });
		}

		const classCall = await prisma.class
			.findUnique({
				where: {
					id: id as string,
				},
				select: {
					name: true,
					classCode: true,
					students: {
						select: {
							name: true,
							id: true,
						},
					},
					classAndOwner: {
						select: {
							teacher: {
								select: {
									name: true,
								},
							},
						},
					},
				},
			})
			.catch((err) => {
				return res
					.status(500)
					.json({ message: "Something went wrong" });
			});

		if (verified.userId) {
			// Get the details of the current user
			const userCall = await prisma.user
				.findUnique({
					where: {
						id: verified.userId,
					},
					select: {
						type: true,
					},
				})
				.catch((err) => {
					return res
						.status(500)
						.json({ message: "Something went wrong" });
				});

			// Check that user even exists
			if (!userCall) {
				return res
					.status(500)
					.json({ message: "Something went wrong" });
			}

			if (userCall.type == "teacher") {
				// If the user is a teacher, we want to send everything we can.
				return res.status(200).json({ ...classCall });
			}

			if (userCall.type == "student") {
				// If the user is a student, we want to send only the name, classCode, and teacher name.
				return res.status(200).json({
					name: classCall?.name,
					classCode: classCall?.classCode,
					classAndOwner: {
						teacher: {
							name: classCall?.classAndOwner?.teacher.name,
						},
					},
				});
			}
		}
	}
}
