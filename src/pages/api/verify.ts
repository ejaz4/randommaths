import type { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../libs/verify";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check if the request method is GET
	if (req.method === "GET") {
		// Get the token from the authorization header
		const token = req.headers.authorization;

		// If there is a token, verify it
		if (token) {
			const verify = await verifyToken(token);

			if (verify) {
				return res.status(200).json({ message: "Token is valid" });
			} else {
				return res.status(400).json({ message: "Token is invalid" });
			}
		} else {
			// If there is no token, return an error
			return res.status(400).json({ message: "No token provided" });
		}
	}
}
