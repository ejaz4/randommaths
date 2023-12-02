import { useEffect, useState } from "react";
import { Checkbox } from "../checkbox";
import { PageConstraints, RawConstraint } from "../constraints";
import { MultiSelect } from "../multi-select";
import { Dialogue } from "../onePageDialogue";
import styles from "./options.module.css";
import { Button } from "../button";
import ChevronRight from "@/assets/chevron-right.svg";

export const TestOptions = ({
	setScreen,
	subtopics,
}: {
	setScreen: any;
	subtopics?: String[];
}) => {
	const [hasTeacher, setHasTeacher] = useState(false);
	const [className, setClassName] = useState("");

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
		const test = {
			subtopics: subtopics,
			questions: questions,
			duration: duration,
			submit: submit,
			breaks: breaks,
			review: review,
		};

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
		}
	};

	useEffect(() => {
		checkClass();
	}, []);

	return (
		<div className={styles.optionsBackground}>
			<RawConstraint>
				<div className={styles.optionsContainer}>
					<div className={styles.buttonContainer}>
						<Button onClick={quit}>Quit</Button>
					</div>
					<Dialogue
						footer={
							<div className={styles.buttonContainer}>
								<div></div>
								<Button
									onClick={startTest}
									image={<ChevronRight />}
								>
									Start
								</Button>
							</div>
						}
					>
						<div className={styles.overview}>
							<h1>Ready to start?</h1>
							<p>Choose how you want this test to be.</p>

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

							{hasTeacher && (
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
						</div>
					</Dialogue>
				</div>
			</RawConstraint>
		</div>
	);
};
