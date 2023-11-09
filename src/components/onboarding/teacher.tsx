import styles from "./Onboarding.module.css";
import { Button } from "../button";
import { emailRegex } from "@/constants/email";
import { Dialogue } from "../onePageDialogue";
import { logout } from "../authentication/sdk";
import LogOut from "@/assets/log-out.svg";

export const TeacherDialogue = ({ name }: { name: string }) => {
	return (
		<Dialogue
			footer={
				<div className={styles.buttonContainer}>
					<div></div>
					<div>
						<a href="/class/create">
							<Button>Create class</Button>
						</a>
						<Button onClick={logout} image={<LogOut />}>
							Log Out
						</Button>
					</div>
				</div>
			}
		>
			<div className={styles.text}>
				<h1>Are they already here?</h1>
				<p>
					{name}, you need to read these instructions carefully before
					continuing.
				</p>
				<p>
					If you are taking over a class, or have just joined a
					school, your institution would most likely already have a
					class with all your students. If that is the case, contact
					your employer to enrol you into the class.
				</p>
				<p>
					If you are sure your students aren't already in a class on
					RandomMaths, create a class for your students.
				</p>
			</div>
		</Dialogue>
	);
};
