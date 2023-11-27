import styles from "./Onboarding.module.css";
import { Button } from "../button";
import { emailRegex } from "@/constants/email";
import { Dialogue } from "../onePageDialogue";
import Link from "@/assets/link.svg";

export const StudentDialogue = ({ name }: { name: string }) => {
	const joinClass = async () => {
		const classCode = (
			document.getElementById("classInput") as HTMLInputElement
		).value
			.trim()
			.toUpperCase();

		if (!classCode) {
			return alert("Please enter a class code.");
		}

		// Check if the class code is valid
		const joinClass = await fetch(`/api/class/${classCode}/join`, {
			method: "POST",
			headers: {
				authorization: localStorage.getItem("token") as string,
				"Content-Type": "application/json",
			},
		});

		// If the class code is valid, redirect to the dashboard
		if (joinClass.status == 200) {
			return (window.location.href = "/dashboard");
		} else {
			return alert("That class code isn't working at the moment.");
		}
	};
	return (
		<Dialogue
			footer={
				<div className={styles.buttonContainer}>
					<div></div>
					<div>
						<a href="/dashboard">
							<Button>Skip</Button>
						</a>
						<Button onClick={joinClass} image={<Link />}>
							Enrol
						</Button>
					</div>
				</div>
			}
		>
			<div className={styles.text}>
				<h1>Do you have a class to join, {name}?</h1>
				<p>Enter your class code below to join it.</p>
			</div>

			<div className={styles.inputContainer}>
				<div>
					<input id="classInput" type="text" placeholder="ABCD1234" />
					<p>
						Your teacher or school should have given you a class
						code. If you didn't join under the advice of your
						school, you can skip this step.
					</p>
				</div>
			</div>
		</Dialogue>
	);
};
