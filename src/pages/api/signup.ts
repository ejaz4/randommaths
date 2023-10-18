import type { NextApiRequest, NextApiResponse } from "next";

import { prisma } from "../../../libs/prisma";
import bcrypt from "bcrypt";

enum UserType {
	"student",
	"teacher",
}

type POSTRequestData = {
	name: string;
	email: string;
	password: string;
	type: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		let { name, email, password, type } = req.body as POSTRequestData;

		if (!name || !email || !password || !type) {
			res.status(400).json({ message: "Missing body parameter(s)" });
			return;
		}

		const salt = bcrypt.genSaltSync(10);
		const newPassword = bcrypt.hashSync(password, salt);

		prisma.user
			.create({
				data: {
					name,
					email,
					password: newPassword,
					salt,
					type,
				},
			})
			.then((user) => {
				res.status(200).json({ success: true });
			})
			.catch((error) => {
				if (error.code === "P2002") {
					res.status(400).json({
						message: "Email already exists",
					});
					return;
				}

				res.status(400).json({ message: error.message });
			});
	}
}
