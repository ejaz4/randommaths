import { Button } from "@/components/button";
import styles from "./teacherView.module.css";

export const Actions = ({ classObj }: { classObj: any }) => {
	return (
		<div className={styles.buttonContainer}>
			<Button>Set work</Button>
		</div>
	);
};
