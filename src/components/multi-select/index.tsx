import { useState } from "react";
import styles from "./index.module.css";

export const MultiSelect = ({
	selections,
	makeId,
}: {
	selections: any[];
	makeId?: string;
}) => {
	// Create a hook to store the selected items
	const [selected, setSelected] = useState(selections[0]);

	return (
		<div className={styles.multiSelect}>
			{selections.map((selection: any, i) => {
				// Create a function to put the selections
				return (
					<div
						className={`${styles.option} ${
							selected == selection ? styles.selected : ""
						}`}
						key={i}
						onClick={() => {
							setSelected(selection);
						}}
					>
						{selection}
					</div>
				);
			})}

			<input
				type="text"
				className={styles.invisibleInput}
				value={selected}
				id={makeId}
				readOnly
			/>
		</div>
	);
};
