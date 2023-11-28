import { useState } from "react";
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
	// Creating variables to store and change them via the checkboxes.
	const [submit, setSubmit] = useState(false);
	const [breaks, setBreaks] = useState(true);
	const [review, setReview] = useState(true);

	// This function will be called when the user clicks the start button.
	const startTest = () => {
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

		console.log({
			submit,
			breaks,
			review,
			questions,
			duration,
			subtopics,
		});
	};

	// Quit button callback.
	const quit = () => {
		setScreen("selection");
	};

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

							<div className={styles.checkmarkOption}>
								<Checkbox
									value={false}
									callback={(option: boolean) => {
										setSubmit(option);
									}}
								/>
								<p>Submit to teacher</p>
							</div>
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
