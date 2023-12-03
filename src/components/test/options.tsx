import { useEffect, useState } from "react";
import { Checkbox } from "../checkbox";
import { PageConstraints, RawConstraint } from "../constraints";
import { MultiSelect } from "../multi-select";
import { Dialogue } from "../onePageDialogue";
import styles from "./options.module.css";
import { Button } from "../button";
import ChevronRight from "@/assets/chevron-right.svg";
import { useRouter } from "next/router";
import CheckIcon from "@/assets/check-def.svg";

export const TestOptions = ({
	setScreen,
	subtopics,
}: {
	setScreen: any;
	subtopics?: String[];
}) => {
	const router = useRouter();

	// For setting work
	const [student, setStudent] = useState("");
	const [sending, setSending] = useState(false);

	const [hasTeacher, setHasTeacher] = useState(false);
	const [className, setClassName] = useState("");
	const [classId, setClassId] = useState("");

	// Creating variables to store and change them via the checkboxes.
	const [submit, setSubmit] = useState(false);
	const [breaks, setBreaks] = useState(true);
	const [review, setReview] = useState(true);

	// This function will be called when the user clicks the start button.
	const startTest = async () => {
		// Get the values from the inputs.
		const questionsInput = document.getElementById(
			"questionLimit"
		) as HTMLInputElement;
		const durationInput = document.getElementById(
			"durationLimit"
		) as HTMLInputElement;

		// Get the values from the inputs.
		const questions = questionsInput.value;
		const duration = durationInput.value;

		// Create a new test object.
		const test: {
			subtopics: any;
			questions: String;
			duration: String;
			submit: String | boolean;
			breaks: boolean;
			review: boolean;
		} = {
			subtopics: subtopics,
			questions: questions,
			duration: duration,
			submit: false,
			breaks: breaks,
			review: review,
		};

		if (submit) {
			test.submit = classId;
		}
		// Send these details off to the server
		const testCreateRequest = await fetch("/api/test/create", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
			body: JSON.stringify(test),
		});

		// Check if the request was unsuccessful.
		if (testCreateRequest.status !== 200) {
			// Return and error.
			alert("Failed to create test.");
			return;
		}

		// get the response from the server
		const testCreateResponse = await testCreateRequest.json();
		localStorage.removeItem("tracking");

		// Redirect to the test.
		window.location.href = `/test/${testCreateResponse.testId}/question`;
	};

	// Quit button callback.
	const quit = () => {
		setScreen("selection");
	};

	const checkClass = async () => {
		const userFetch = await fetch("/api/user", {
			method: "GET",
			headers: {
				authorization: localStorage.getItem("token") as string,
			},
		});

		if (userFetch.status !== 200) {
			return;
		}

		const user = await userFetch.json();

		if (user.user.class) {
			setHasTeacher(true);
			setClassName(user.user.class.name);
			setClassId(user.user.class.id);
		}
	};

	// This function will only be called when the user clicks the set work button and they have a class.
	const setWork = async () => {
		// Get the values from the inputs.
		const questionsInput = document.getElementById(
			"questionLimit"
		) as HTMLInputElement;
		const durationInput = document.getElementById(
			"durationLimit"
		) as HTMLInputElement;
		const workNameInput = document.getElementById(
			"workName"
		) as HTMLInputElement;

		// Get the values from the inputs.
		const questions = questionsInput.value;
		const duration = durationInput.value;
		const workName = workNameInput.value;

		// Create a new test object.
		const test = {
			title: workName ? workName : "Untitled",
			subtopics: subtopics,
			questions: questions,
			duration: duration,
			submit: router.query.classId,
			breaks: breaks,
			review: review,
		};

		// Get the class
		const classFetch = await fetch(
			`/api/class/${router.query.classId}/details`,
			{
				method: "GET",
				headers: {
					authorization: localStorage.getItem("token") as string,
				},
			}
		);

		if (classFetch.status !== 200) {
			alert("Failed to get class.");
			return;
		}

		const classObj = await classFetch.json();

		// Send these details off to the server
		const students = classObj.students;

		setSending(true);

		for (const student of students) {
			setStudent(student.name);

			console.log("Set work for " + student.name);

			const testCreateRequest = await fetch("/api/test/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					authorization: localStorage.getItem("token") as string,
				},
				body: JSON.stringify({ targetUserId: student.id, ...test }),
			});

			// Check if the request was unsuccessful.
			if (testCreateRequest.status !== 200) {
				// Return and error.
				alert(`Could not send work to ${student.name}.`);
			}
		}

		setSending(false);
		window.location.replace(`/class/${router.query.classId}`);
	};

	useEffect(() => {
		checkClass();
	}, []);

	return (
		<div className={styles.optionsBackground}>
			<RawConstraint>
				<div className={styles.optionsContainer}>
					{!sending && (
						<>
							<div className={styles.buttonContainerTop}>
								<Button onClick={quit}>Quit</Button>
							</div>

							<Dialogue
								footer={
									<div className={styles.buttonContainer}>
										<div></div>
										{!router.query.classId && (
											<Button
												onClick={startTest}
												image={<ChevronRight />}
											>
												Start
											</Button>
										)}
										{router.query.classId && (
											<>
												<Button
													onClick={startTest}
													image={<ChevronRight />}
												>
													Try
												</Button>
												<Button
													onClick={setWork}
													image={<CheckIcon />}
												>
													Set work
												</Button>
											</>
										)}
									</div>
								}
							>
								<div className={styles.overview}>
									{!router.query.classId && (
										<h1>Ready to start?</h1>
									)}

									{router.query.classId && (
										<h1>Setting for your class</h1>
									)}
									<p>
										Choose how you want this{" "}
										{router.query.classId
											? "piece of work"
											: "test"}{" "}
										to be.
									</p>

									{router.query.classId && (
										<div
											className={styles.option}
											style={{ width: "100%" }}
										>
											<p>Work name</p>
											<input id="workName" type="text" />
										</div>
									)}

									<div className={styles.option}>
										<p>Number of Questions</p>
										<MultiSelect
											makeId="questionLimit"
											selections={[5, 10, 15]}
										/>
									</div>

									<div className={styles.option}>
										<p>Maximum Duration</p>
										<MultiSelect
											makeId="durationLimit"
											selections={[
												"10 minutes",
												"20 minutes",
												"30 minutes",
												"1 hour",
												"No limit",
											]}
										/>
									</div>

									{hasTeacher && !router.query.classId && (
										<div className={styles.checkmarkOption}>
											<Checkbox
												value={false}
												callback={(option: boolean) => {
													setSubmit(option);
												}}
											/>
											<p>Submit to {className}</p>
										</div>
									)}
									<div className={styles.checkmarkOption}>
										<Checkbox
											value={true}
											callback={(option: boolean) => {
												setBreaks(option);
											}}
										/>
										<p>Breaks allowed</p>
									</div>
									<div className={styles.checkmarkOption}>
										<Checkbox
											value={true}
											callback={(option: boolean) => {
												setReview(option);
											}}
										/>
										<p>Review after each question</p>
									</div>
									{router.query.classId && (
										<div>
											<p>
												Once you set work, you can no
												longer take it back.
											</p>
										</div>
									)}
								</div>
							</Dialogue>
						</>
					)}

					{sending && (
						<Dialogue>
							<div className={styles.overview}>
								<h1>Setting work</h1>
								<p>Currently sending to {student}.</p>
							</div>
						</Dialogue>
					)}
				</div>
			</RawConstraint>
		</div>
	);
};
