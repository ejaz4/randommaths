import styles from "./ProgressBar.module.css";

export const ProgressBar = ({ progress }: { progress: number }) => {
	return (
		<div className={styles.parent}>
			<div
				className={styles.child}
				style={{ maxWidth: progress + "%" }}
			></div>
		</div>
	);
};
