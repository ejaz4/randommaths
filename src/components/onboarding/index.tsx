import { useEffect, useState } from "react";
import styles from "./Onboarding.module.css";
import { Skeleton } from "../skeleton";
import { StudentDialogue } from "./student";
import { TeacherDialogue } from "./teacher";
import { Dialogue } from "../onePageDialogue";
import { ActOnVerify, verify } from "../authentication/sdk";

// This is the authentication form that will handle all types of authentication, such as logging in, logging out and handling password reset requests.
export const OnboardingDialogue = () => {
	const [currentScreen, setCurrentScreen] = useState("loading");
	const [name, setName] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		ActOnVerify();

		if (token) {
			fetch("/api/user", {
				headers: {
					authorization: localStorage.getItem("token") as string,
				},
			}).then((response) => {
				if (response.status == 200) {
					response.json().then((data) => {
						setName(data.user.name.split(" ")[0]);
						setCurrentScreen(data.user.type);
					});
				} else {
					window.location.href = "/auth";
				}
			});
		}
	}, []);

	return (
		<>
			{/* If the currentScreen is equal to student, show the student dialogue */}
			{currentScreen == "student" && <StudentDialogue name={name} />}
			{/* If the currentScreen is equal to teacher, show the teacher dialogue */}
			{currentScreen == "teacher" && <TeacherDialogue name={name} />}

			{currentScreen == "loading" && <SkeletonOnboarding />}
		</>
	);
};

const SkeletonOnboarding = () => {
	return (
		<Dialogue>
			<div className={styles.text} style={{ gap: "5px" }}>
				<Skeleton width={300} height={43} />
				<Skeleton width={245} height={22} />
			</div>

			<div className={styles.inputContainer} style={{ marginTop: 20 }}>
				<div>
					<Skeleton width={"100%"} height={52} />
					<br></br>
					<Skeleton width={472} height={22} />
				</div>
			</div>
		</Dialogue>
	);
};
