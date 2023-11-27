import { PageConstraints } from "@/components/constraints";
import styles from "./teacherView.module.css";
import ChevronDown from "@/assets/chevron-down.svg";

export const StudentsList = ({ classObj }: { classObj: any }) => {
	if (Object.keys(classObj).length == 0) {
		return <></>;
	}

	const students = classObj.students;

	return (
		<div className={styles.studentList}>
			{students.map((student: any) => {
				return (
					<StudentItem
						key={student.id}
						studentName={student.name}
						studentId={student.id}
					/>
				);
			})}
		</div>
	);
};

export const StudentItem = ({
	studentName,
	studentId,
}: {
	studentName: string;
	studentId: string;
}) => {
	return (
		<div className={styles.studentListItem}>
			<p>{studentName}</p>
			<div className={styles.studentListItemAction}>
				<ChevronDown />
			</div>
		</div>
	);
};
