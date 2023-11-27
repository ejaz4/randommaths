import { request } from "http";
import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../libs/verify";
import { prisma } from "../../../../libs/prisma";

type ClassReturnPOSTRequest = {
	classId: string;
};

// This route will get the classAndOwnerId and return the actual classId.
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method == "POST") {
		// Check if token is provided
		const token = req.headers.authorization;

		// If no token provided
		if (!token) {
            // Return error
            return res.status(400).json({ message: "No token provided" });
        }

        // Verify token
		const verify = await verifyToken(token);

        if (!verify.status) {
            // Return error
            return res.status(400).json({ message: "Token is invalid" });
        }

        const { classId } = req.body as ClassReturnPOSTRequest;

        if (!classId) {
            return res.status(400).json({ message: "Class ID is required" });
        }

        const classObj = await prisma.class.findUnique({
            where: {
                classAndOwnerId: classId
            },
            select: {
                id: true
            }
        }).catch((err) => {
            return res.status(400).json({ message: "Class ID is invalid" });
        });

        if (!classObj) {
            return res.status(400).json({ message: "Class ID is invalid" });
        }

        return res.status(200).json({ classId: classObj.id });
	}
}
