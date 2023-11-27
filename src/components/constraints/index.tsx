import { Header } from "../header";
import styles from "./PageConstraints.module.css";

export const PageConstraints = ({ children }: { children: any }) => {
	return (
		<>
			<Header />
			<div className={styles.pageConstraints}>{children}</div>
		</>
	);
};
