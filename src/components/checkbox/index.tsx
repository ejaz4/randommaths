import { useState } from "react";
import styles from "./checkbox.module.css";
import Check from "@/assets/check.svg";

export const Checkbox = ({
	value = false,
	enabled = true,
	callback = (checked: boolean) => {},
}: {
	value?: boolean;
	enabled?: boolean;
	callback?: any;
}) => {
	const [checked, setChecked] = useState(value);

	const toggleCheck = () => {
		if (enabled) {
			setChecked(!checked);
			callback(!checked, setChecked);
		}
	};
	return (
		<div
			className={`${styles.checkbox} ${checked ? styles.checked : ""}`}
			onClick={() => {
				toggleCheck();
			}}
		>
			<div className={styles.check}>
				<Check />
			</div>
			<input
				className={styles.invisibleCheckbox}
				type="checkbox"
				defaultChecked={checked}
			/>
		</div>
	);
};
