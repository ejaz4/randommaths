import { SkeletonView } from "../skeleton/teacherView";
import { Actions } from "./actions";
import { StudentsList } from "./studentsList";
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
			{screen != "skeleton" && <div style={{ margin: "24px" }} className={styles.className}>
				<h1>{classObj.name}</h1>
				<div>
					<h1>{classObj.classCode}</h1>
				</div>
			</div>}
			{screen == "teacherView" && <TeacherView classObj={classObj} />}
			{screen == "skeleton" && <SkeletonView />}
		</>
	);
};

export const TeacherView = ({ classObj }: { classObj: any }) => {
	return (
		<div className={styles.teacherView}>
			<Actions classObj={classObj} />
			<StudentsList classObj={classObj} />
		</div>
	);
};
