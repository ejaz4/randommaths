import styles from "./Onboarding.module.css";
import { Button } from "../button";
import { emailRegex } from "@/constants/email";
import { Dialogue } from "../onePageDialogue";
import Link from "@/assets/link.svg";

export const StudentDialogue = ({ name }: { name: string }) => {
	return (
		<Dialogue
			footer={
				<div className={styles.buttonContainer}>
					<div></div>
					<div>
						<a href="/dashboard">
							<Button>Skip</Button>
						</a>
						<Button image={<Link/>}>Enrol</Button>
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
