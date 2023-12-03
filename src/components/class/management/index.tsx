import { SkeletonView } from "../skeleton/teacherView";
import { TeacherActions, StudentActions } from "./actions";
import { StudentsList } from "./studentsList";
import { TaskList } from "./taskList";
import styles from "./teacherView.module.css";

export const ClassManagement = ({
	screen,
	classObj,
}: {
	screen: string;
	classObj: any;
}) => {
	return (
		<>
			{screen != "skeleton" && (
				<div style={{ margin: "24px" }} className={styles.className}>
					<h1>{classObj.name}</h1>
					<div>
						<h1>{classObj.classCode}</h1>
					</div>
				</div>
			)}
			{screen == "teacherView" && <TeacherView classObj={classObj} />}
			{screen == "studentView" && <StudentView classObj={classObj} />}
			{screen == "skeleton" && <SkeletonView />}
		</>
	);
};

export const StudentView = ({ classObj }: { classObj: any }) => {
	return (
		<div className={styles.teacherView}>
			<StudentActions classObj={classObj} />
			<TaskList />
		</div>
	);
};

export const TeacherView = ({ classObj }: { classObj: any }) => {
	return (
		<div className={styles.teacherView}>
			<TeacherActions classObj={classObj} />
			<StudentsList classObj={classObj} />
		</div>
	);
};
