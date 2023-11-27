import styles from "./Login.module.css";
import { Button } from "../button";
import LoginIcon from "../../assets/log-in.svg";
import UserPlus from "../../assets/user-plus.svg";
import ChevronRight from "../../assets/chevron-right.svg";
import { emailRegex } from "@/constants/email";
import { useState } from "react";
import { Dialogue } from "../onePageDialogue";
import { Checkbox } from "../checkbox";

export const SignupDialogue = ({ setScreen }: { setScreen: any }) => {
	const inputValidation = async () => {
		// Get all the inputs
		const nameInput = document.getElementById(
			"nameInput"
		) as HTMLInputElement;
		const emailInput = document.getElementById(
			"emailInput"
		) as HTMLInputElement;
		const passwordInput = document.getElementById(
			"passwordInput"
		) as HTMLInputElement;
		const passwordConfirmInput = document.getElementById(
			"passwordConfirm"
		) as HTMLInputElement;
		const userTypeInput = document.getElementById(
			"userType"
		) as HTMLSelectElement;

		// Get the values of the inputs
		const name = nameInput.value.trim();
		const emailAddress = emailInput.value;
		const password = passwordInput.value;
		const passwordConfirm = passwordConfirmInput.value;
		const userType = userTypeInput.value;

		// Create an object to store the validity of the inputs, they are true until proven false.
		var valid = {
			name: true,
			email: true,
			password: true,
			confirm: true,
		};

		if (name == "") valid.name = false;

		// Check if the email address is empty or if it doesn't match the email regex
		if (emailAddress.trim() == "") valid.email = false;

		// Check if the password is less than 8 characters
		if (!emailRegex.test(emailAddress)) valid.email = false;

		// Check if the password is less than 8 characters
		if (password.length < 8) valid.password = false;

		// Check if the password and the password confirm are the same
		if (password != passwordConfirm) valid.confirm = false;

		if (!valid.name) {
			nameInput.classList.add(styles.invalid);
			nameInput.classList.add(styles.invalidAnimation);

			nameInput.addEventListener("animationend", () => {
				nameInput.classList.remove(styles.invalidAnimation);
			});
		}

		// If the email address is invalid, add the invalid class and the animation class
		if (!valid.email) {
			emailInput.classList.add(styles.invalid);
			emailInput.classList.add(styles.invalidAnimation);

			emailInput.addEventListener("animationend", () => {
				emailInput.classList.remove(styles.invalidAnimation);
			});
		}

		// If the password is invalid, add the invalid class and the animation class
		if (!valid.password) {
			passwordInput.classList.add(styles.invalid);
			passwordInput.classList.add(styles.invalidAnimation);

			passwordInput.addEventListener("animationend", () => {
				passwordInput.classList.remove(styles.invalidAnimation);
			});
		}

		if (!valid.confirm) {
			passwordConfirmInput.classList.add(styles.invalid);
			passwordConfirmInput.classList.add(styles.invalidAnimation);

			passwordConfirmInput.addEventListener("animationend", () => {
				passwordConfirmInput.classList.remove(styles.invalidAnimation);
			});
		}

		var allValid = true;
		for (const [key, value] of Object.entries(valid)) {
			if (value == false) {
				allValid = false;
			}
		}

		// If both the email and password are valid, remove the invalid class
		if (allValid) {
			nameInput.classList.remove(styles.invalid);
			emailInput.classList.remove(styles.invalid);
			passwordInput.classList.remove(styles.invalid);

			const signUpRequest = await fetch("/api/signup", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					name: name,
					email: emailAddress,
					password: password,
					type: userType,
				}),
			});

			if (signUpRequest.status == 200) {
				const loginRequest = await fetch("/api/login", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						email: emailAddress,
						password: password,
					}),
				});

				if (loginRequest.status == 200) {
					const loginResponse = await loginRequest.json();
					localStorage.setItem("token", loginResponse.token);
					window.location.href = "/onboarding";
				}
			} else {
				alert("An error occured, please try again later");
				throw new Error(
					`Received ${signUpRequest.status} from the server.`
				);
			}
		}
	};

	return (
		<Dialogue
			footer={
				<div className={styles.buttonContainer}>
					<div>
						<Button
							onClick={() => {
								setScreen("login");
							}}
							image={<LoginIcon />}
						>
							Log In
						</Button>
					</div>
					<div>
						<Button
							onClick={inputValidation}
							image={<ChevronRight />}
						>
							Next
						</Button>
					</div>
				</div>
			}
		>
			<div className={styles.text}>
				<h1>Welcome to RandomMaths</h1>
				<p>
					RandomMaths is the ultimate mathematics platform for
					students aged 13-16
				</p>
			</div>

			<div className={styles.inputContainer}>
				<div>
					<p>Enter your full name</p>
					<input
						type="text"
						id="nameInput"
						className={styles.loginInput}
					/>
					<p>
						Use your full name as it would typically appear on
						school registers
					</p>
				</div>

				<div>
					<p>Enter your email address</p>
					<input
						type="email"
						id="emailInput"
						className={styles.loginInput}
					/>
					<p>
						Please use your personal email address to sign up for
						RandomMaths
					</p>
				</div>

				<div>
					<p>Choose a passphrase</p>
					<input
						type="password"
						id="passwordInput"
						minLength={8}
						className={styles.loginInput}
					/>

					<p>Confirm your passphrase</p>
					<input
						type="password"
						id="passwordConfirm"
						minLength={8}
						className={styles.loginInput}
					/>
				</div>

				<div>
					<p>What best describes you?</p>
					<select id="userType">
						<option value="student">Student</option>
						<option value="teacher">Teacher</option>
					</select>

					<Checkbox />
				</div>
			</div>
		</Dialogue>
	);
};
