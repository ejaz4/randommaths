import styles from "./Button.module.css";

// This is a standard button component that can be used anywhere in the app
export const Button = ({
	children,
	image,
	onClick,
	variant = "white",
}: {
	children: any;
	image?: any;
	onClick?: () => void;
	variant?: "white" | "invert";
}) => {
	return (
		<button
			onClick={onClick}
			className={`${styles.button} ${
				variant == "invert" ? styles.invert : ""
			}`}
		>
			{children}
			{image && image}
		</button>
	);
};
