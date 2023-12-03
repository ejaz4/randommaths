import { Button } from "@/components/button";
import { RawConstraint } from "@/components/constraints";
import { Header } from "@/components/header";
import { Dialogue } from "@/components/onePageDialogue";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SendIcon from "@/assets/send.svg";
import test from "node:test";

interface TestDetails {
	id: string;
	title: string;
	questionMax: number;
	questionsCorrect: number;
	currentQuestion: number;
	status: string;
	startTime: string;
	endTime: string | null;
	duration: number;
	onBreak: boolean;
	reviewAfter: boolean;
	breaksAllowed: boolean;
	cheating: boolean;
	subTopics: string;
	updatedAt: string;
}

interface Proficiency {
	id: string;
	userId: string;
	level: number;
}

export const TestQuestionPage = () => {
	const router = useRouter();
	const [testDetails, setTestDetails] = useState({} as any);

	const [subtopics, setSubtopics] = useState([] as string[]);
	const [chosenSubtopic, setChosenSubtopic] = useState("");

	const endExam = async (testID?: string) => {
		console.log("Test has been officially ended.");
		if (!testID) {
			testID = router.query.id as string;
		}
		const endRequest = await fetch(`/api/test/${testID}/update`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
			body: JSON.stringify({
				status: "ended",
			}),
		});

		if (endRequest.status == 200) {
			window.location.href = `/test/${testID}/results`;
		}
	};

	useEffect(() => {
		const nextTracking = btoa(Math.random().toString(36));

		const trackingLS = localStorage.getItem("tracking");
		if (router.query.tracking) {
			if (router.query.tracking !== trackingLS) {
				alert("This test has been cancelled.");
				endExam();
			} else {
				console.log("Test is valid");
				localStorage.setItem("tracking", nextTracking);
			}
		} else if (!trackingLS) {
			console.log("No tracking, creating tracking");
			localStorage.setItem("tracking", nextTracking);
		}
	}, [router.query.tracking]);

	const generateQuestion = async (proficiency: Proficiency[]) => {
		// Set the max level to 0 initially
		let maxLevel = 0;

		// Then add all the levels together.
		for (const item of proficiency) {
			maxLevel += item.level != 0 ? item.level : 1;
		}

		// Then get the compressed level (to 1).
		const compressed = 1 / maxLevel;

		// Create segments
		let segments: {
			[id: string]: number;
		} = {};

		// Populate segments
		for (const item of proficiency) {
			segments[item.id] = 1 - item.level * compressed;
		}

		// Create cumulative segments
		let cumulativeSegments: {
			[id: string]: number;
		} = {};

		// Populate cumulative segments
		let lastVal = 0;
		// Should equal to 1 in the end.
		for (const [key, value] of Object.entries(segments)) {
			cumulativeSegments[key] = value + lastVal;
			lastVal = value + lastVal;
		}

		// Get a random number between 0 and 1.
		const rand = Math.random();

		// Get the subtopic from the random number.
		let subtopic = "";
		for (const [key, value] of Object.entries(cumulativeSegments)) {
			if (rand <= value) {
				subtopic = key;
				break;
			}
		}

		if (proficiency.length == 1) {
			subtopic = proficiency[0].id;
		}

		setChosenSubtopic(subtopic);
	};

	const getProficiency = async (subtopics: string[]) => {
		console.log("Getting proficiency");
		// Gets the user's proficiency.
		const proficiencyRequest = await fetch(
			"/api/user/@me/proficiency/get",
			{
				method: "POST",
				headers: {
					authorization: localStorage.getItem("token") as string,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subtopics),
			}
		);

		// Check if the request was unsuccessful.
		if (proficiencyRequest.status !== 200) {
			// Return and error.
			alert("Your personal user statistics could not be loaded.");
			window.location.replace("/test/selection");
			return;
		}
		const proficiencyResponse = await proficiencyRequest.json();

		await generateQuestion(proficiencyResponse);
	};

	const parseTestDetails = async (testDetails: TestDetails) => {
		// Get the test details.
		const {
			id,
			title,
			questionMax,
			questionsCorrect,
			currentQuestion,
			status,
			startTime,
			endTime,
			onBreak,
			reviewAfter,
			breaksAllowed,
			cheating,
			subTopics,
			updatedAt,
			duration,
		} = testDetails;

		if (status == "break") {
			// The test was just on a break.
			let newDuration = null;
			let prevDuration = new Date(
				new Date(updatedAt).getTime() - new Date(startTime).getTime()
			).getTime();

			let durationRemaining = duration - prevDuration;

			if (duration != 0) {
				const now = new Date().getTime();
				newDuration = new Date(now + durationRemaining).toISOString();
			} else {
				newDuration = null;
			}

			const startTestRequest = await fetch(`/api/test/${id}/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: localStorage.getItem("token") as string,
				},
				body: JSON.stringify({
					status: "started",
					startTime: new Date().toISOString(),
					endTime: newDuration,
				}),
			});

			// Check if the request was unsuccessful.
			if (startTestRequest.status !== 200) {
				// Return and error.
				alert("Failed to start test.");
				return;
			}

			// Reload the page with tracking.
			window.location.replace(
				`/test/${id}/question?tracking=${localStorage.getItem(
					"tracking"
				)}`
			);
		}

		if (status == "incomplete") {
			// The test has not started yet, the test is yet to be initialised.
			let newDuration = null;

			if (duration != 0) {
				const now = new Date().getTime();
				newDuration = new Date(now + duration).toISOString();
			}

			const startTestRequest = await fetch(`/api/test/${id}/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: localStorage.getItem("token") as string,
				},
				body: JSON.stringify({
					status: "started",
					startTime: new Date().toISOString(),
					endTime: newDuration,
				}),
			});

			// Check if the request was unsuccessful.
			if (startTestRequest.status !== 200) {
				// Return and error.
				alert("Failed to start test.");
				return;
			}

			// Reload the page with tracking.
			window.location.replace(
				`/test/${id}/question?tracking=${localStorage.getItem(
					"tracking"
				)}`
			);
			return;
		}

		if (currentQuestion == 0) {
			let body = {
				currentQuestion: 1,
				status: "started",
				startTime: new Date().toISOString(),
			};

			// The test has not started yet, the test is yet to be initialised.
			const startTestRequest = await fetch(`/api/test/${id}/update`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: localStorage.getItem("token") as string,
				},
				body: JSON.stringify(body),
			});

			// Check if the request was unsuccessful.
			if (startTestRequest.status !== 200) {
				// Return and error.
				alert("Failed to start test.");
				return;
			}

			// Reload the page with tracking.
			window.location.replace(
				`/test/${id}/question?tracking=${localStorage.getItem(
					"tracking"
				)}`
			);
			return;
		}

		// if (router.query.tracking !== localStorage.getItem("tracking")) {
		// 	// The tracking is invalid, the test is invalid.
		// 	console.log(
		// 		"Cancelling Test",
		// 		router.query.tracking,
		// 		localStorage.getItem("tracking")
		// 	);
		// 	return;
		// }

		if (status == "ended") {
			// The test has ended, redirect to the results page.
			window.location.replace(`/test/${id}/results`);
			return;
		}

		if (currentQuestion > questionMax) {
			console.log(
				"Ending exam, the current question is larger than the question max."
			);
			endExam(id);
		}

		setSubtopics(JSON.parse(subTopics));
		getProficiency(JSON.parse(subTopics));
		console.log("hi", subTopics);
	};

	const loadTestDetails = async () => {
		const id = router.query.id;

		if (!id) {
			return;
		}

		// Create a request to the server for the latest information about the test.
		const testDetailsRequest = await fetch(`/api/test/${id}/latest`, {
			method: "GET",
			headers: {
				authorization: localStorage.getItem("token") as string,
			},
		});

		// Check if the request was unsuccessful.
		if (testDetailsRequest.status !== 200) {
			// Return and error.
			alert(
				"The RandomMaths network could not locate this test. Either you don't have permission to view it or it does not exist.\nIf you had just created this test, chances are your teacher may have cancelled it or prevented it from being created."
			);
			window.location.href = "/test/selection";
			return;
		}

		// Get the response from the server.
		const testDetailsResponse = await testDetailsRequest.json();

		// Set the test details.
		setTestDetails(testDetailsResponse);

		parseTestDetails(testDetailsResponse);
		console.log(testDetailsResponse);
	};

	useEffect(() => {
		loadTestDetails();
	}, [router.query.id]);

	return (
		<div>
			<Header screenData={testDetails} screenType={"test"} />

			<RawConstraint>
				{chosenSubtopic != "" && (
					<Subtopic
						testDetails={testDetails}
						chosenSubtopic={chosenSubtopic}
					/>
				)}
			</RawConstraint>
		</div>
	);
};

const Subtopic = ({
	chosenSubtopic,
	testDetails,
}: {
	chosenSubtopic: string;
	testDetails: TestDetails;
}) => {
	const [question, setQuestion] = useState({} as any);
	const [subtopic, setSubtopic] = useState({} as any);

	const [screen, setScreen] = useState("question");

	const chooseQuestion = async (response: any) => {
		const questions = response;

		const question =
			questions[Math.floor(Math.random() * questions.length)];

		setQuestion(question);
	};

	const loadSubtopics = async () => {
		const subtopicRequest = await fetch(`/tests/${chosenSubtopic}`);

		// Check if the request was unsuccessful.
		if (subtopicRequest.status !== 200) {
			// Return and error.
			return;
		}

		const subtopicResponse = await subtopicRequest.json();

		console.log(subtopicResponse);
		setSubtopic(subtopicResponse);
		chooseQuestion(subtopicResponse);
	};

	const [answer, setAnswer] = useState("");

	const sendServerFeedback = async (correct: boolean) => {
		const id = testDetails.id;

		if (!id) {
			return;
		}

		const testUpdateRequest = await fetch(`/api/test/${id}/update`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
			body: JSON.stringify({
				questionsCorrect:
					testDetails.questionsCorrect + (correct ? 1 : 0),
				currentQuestion: testDetails.currentQuestion + 1,
			}),
		});

		// Check if the request was unsuccessful.
		if (testUpdateRequest.status !== 200) {
			// Return and error.
			alert("Failed to update test.");
			return;
		}

		const updateProficiencyRequest = await fetch(
			"/api/user/@me/proficiency/update",
			{
				method: "POST",
				body: JSON.stringify({
					subTopicId: chosenSubtopic,
					increase: correct,
				}),
				headers: {
					authorization: localStorage.getItem("token") as string,
					"Content-Type": "application/json",
				},
			}
		);

		// Check if the request was unsuccessful.
		if (updateProficiencyRequest.status !== 200) {
			// Return and error.
			alert(
				"There was an error and your proficiency could not be recorded this time."
			);
			return;
		}

		const updateProficiencyResponse = await updateProficiencyRequest.json();
	};

	const answerCorrectAction = async () => {
		await sendServerFeedback(true);
		if (testDetails.reviewAfter) {
			setScreen("review");
			setAnswer("correct");
		} else {
			window.location.href = `/test/${
				testDetails.id
			}/question?tracking=${localStorage.getItem("tracking")}`;
		}
	};

	const answerIncorrectAction = async () => {
		await sendServerFeedback(false);
		if (testDetails.reviewAfter) {
			setScreen("review");
			setAnswer("incorrect");
		} else {
			window.location.href = `/test/${
				testDetails.id
			}/question?tracking=${localStorage.getItem("tracking")}`;
		}
	};

	useEffect(() => {
		loadSubtopics();
	}, []);

	return (
		<>
			{screen == "question" && (
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						gap: 20,
						marginTop: 20,
					}}
				>
					<Question question={question} />
					<Answer
						incorr={answerIncorrectAction}
						corr={answerCorrectAction}
						question={question}
					/>
				</div>
			)}

			{screen == "review" && (
				<div>
					<h1>Your answer was {answer}</h1>
					{answer == "correct" && (
						<p>You did well on this question, keep going!</p>
					)}

					{answer == "incorrect" && (
						<p>
							Keep trying, use the Review Weaknesses option at
							after the exam to go over these again.
						</p>
					)}

					<Button
						onClick={() => {
							window.location.href = `/test/${
								testDetails.id
							}/question?tracking=${localStorage.getItem(
								"tracking"
							)}`;
						}}
					>
						Next
					</Button>
				</div>
			)}
		</>
	);
};

const Question = ({ question }: { question: any }) => {
	return (
		<Dialogue>
			<div>
				<img src={question.src} style={{ width: "100%" }} />
			</div>
		</Dialogue>
	);
};

const Answer = ({
	question,
	corr,
	incorr,
}: {
	question: any;
	corr: any;
	incorr: any;
}) => {
	if (!question.answers) {
		return <div></div>;
	}

	const [correct, setCorrect] = useState(false);

	const checkCorr = () => {
		if (correct) {
			corr();
		} else {
			incorr();
		}
	};

	return (
		<Dialogue
			footer={
				<div
					style={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						paddingTop: "20px",
					}}
				>
					<p>
						Once you leave this question, you cannot answer it
						again.
					</p>

					<Button onClick={checkCorr} image={<SendIcon />}>
						Submit Answer
					</Button>
				</div>
			}
		>
			<div className="w-100">
				<p>Type your answers here</p>
				{Object.keys(question.answers).map((key: string, i) => {
					return (
						<AnswerInput
							title={key}
							answer={question.answers[key]}
							key={i}
							setCorrect={setCorrect}
						/>
					);
				})}
			</div>
		</Dialogue>
	);
};

const AnswerInput = ({
	title,
	answer,
	setCorrect,
}: {
	title: string;
	answer: any;
	setCorrect: any;
}) => {
	const checkAnswer = () => {
		const input = document.getElementById(title) as HTMLInputElement;

		const userAnswer = input.value;

		if (userAnswer != answer) {
			setCorrect(false);
		} else {
			setCorrect(true);
		}
		console.log(userAnswer == answer);
	};

	return (
		<div
			style={{
				display: "flex",
				alignItems: "center",
				gap: "10px",
				justifyContent: "center",
			}}
		>
			<label htmlFor={title}>{title}</label>
			<input
				type="text"
				name="answer"
				id={title}
				placeholder="Enter your answer here"
				onChange={checkAnswer}
			/>
		</div>
	);
};

export default TestQuestionPage;
