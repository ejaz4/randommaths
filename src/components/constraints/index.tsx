import { Header } from "../header";
import styles from "./PageConstraints.module.css";

export const PageConstraints = ({ children }: { children: any }) => {
	return (
		<>
			<Header />
			<RawConstraint>{children}</RawConstraint>
		</>
	);
};

export const RawConstraint = ({ children }: { children: any }) => {
	return <div className={styles.pageConstraints}>{children}</div>;
};
