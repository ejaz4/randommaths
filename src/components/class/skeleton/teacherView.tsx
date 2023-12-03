import { Skeleton } from "@/components/skeleton";
import styles from "../management/teacherView.module.css";

export const SkeletonView = () => {
	return (
		<>
			<br></br>
			<br></br>
			<Skeleton width="400px" height="40px" />
			<br></br>
			<br></br>
			<div className={styles.studentList}>
				{[...Array(8)].map((_, i) => {
					return (
						<div key={i} className={styles.studentListItem}>
							<span style={{ marginTop: 16, marginBottom: 16 }}>
								<Skeleton
									width={`${Math.max(
										Math.floor(Math.random() * 200),
										100
									)}px`}
									height="20px"
								/>
							</span>

							<div className={styles.studentListItemAction}></div>
						</div>
					);
				})}
			</div>
		</>
	);
};
