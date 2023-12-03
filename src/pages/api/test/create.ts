import { NextApiRequest, NextApiResponse } from "next";
import { verifyToken } from "../../../../libs/verify";
import { prisma } from "../../../../libs/prisma";
import { Prisma, Work } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

type TestCreatePOSTRequest = {
	subtopics: string[];
	submit: boolean | string;
	breaks: boolean;
	review: boolean;
	questions: string;
	duration: string;
	targetUserId?: string;
	title?: string;
};

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	// Check if the request is POST
	if (req.method == "POST") {
		// Get the token to identify the user
		const token = req.headers.authorization;

		console.log(req.body);
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

		// Get the body of the request
		const { subtopics, submit, breaks, review, questions, duration } =
			req.body as TestCreatePOSTRequest;

		// Check if all the information is there.
		if (
			!subtopics ||
			submit == null ||
			breaks == null ||
			review == null ||
			!questions ||
			!duration
		) {
			return res.status(400).json({ message: "Invalid body" });
		}

		// Change duration
		let dur = 0;

		// Convert the duration from a string to an integer
		if (duration == "10 minutes") dur = 10;
		if (duration == "20 minutes") dur = 20;
		if (duration == "30 minutes") dur = 30;
		if (duration == "1 hour") dur = 60;
		if (duration == "No limit") dur = 0;

		const durationInMs = dur * 60 * 1000;

		let userID = verify.userId;

		if (req.body.targetUserId) {
			userID = req.body.targetUserId;
		}

		const user = await prisma.user
			.findUnique({
				where: {
					id: userID,
				},
				select: {
					name: true,
				},
			})
			.catch((err) => {
				return res.status(400).json({ message: "Invalid token" });
			});

		// Check if the user exists
		if (!user) {
			return res.status(400).json({ message: "Invalid token" });
		}

		// Get the time of day
		let dateAPI = new Date();
		let timeOfDay = "morning";

		// If statement to check which part of the day it is.
		if (dateAPI.getHours() >= 12 && dateAPI.getHours() < 18) {
			timeOfDay = "afternoon";
		} else if (dateAPI.getHours() >= 18) {
			timeOfDay = "evening";
		}

		// Create the title, format should be "Name's TimeofDay Test"
		let forgedTitle = `${user.name?.split(" ")[0]}'s ${timeOfDay} test`;

		if (req.body.title) {
			forgedTitle = req.body.title;
		}

		// Create the test
		const test = await prisma.work
			.create({
				data: {
					subTopics: JSON.stringify(subtopics),
					breaksAllowed: breaks,
					reviewAfter: review,
					questionMax: parseInt(questions),
					currentQuestion: 0,
					questionsCorrect: 0,
					user: {
						connect: {
							id: userID,
						},
					},
					startTime: new Date(),
					duration: durationInMs,
					onBreak: false,
					title: forgedTitle,
				},
			})
			.catch((err) => {
				return res
					.status(400)
					.json({ message: "Could not make the test." });
			});

		// Check if the test was created
		if (!test) {
			return res
				.status(400)
				.json({ message: "Could not make the test." });
		}

		if (durationInMs != 0) {
			await prisma.work.update({
				where: {
					id: test.id,
				},
				data: {
					endTime: new Date(Date.now() + durationInMs),
				},
			});
		}

		if (typeof submit == "string") {
			await prisma.work.update({
				where: {
					id: test.id,
				},
				data: {
					sendTo: {
						connect: {
							id: submit,
						},
					},
					status: "incomplete",
				},
			});
		}

		return res
			.status(200)
			.json({ message: "Test created", testId: test.id });
	}
}
