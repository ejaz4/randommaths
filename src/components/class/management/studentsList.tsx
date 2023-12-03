import { PageConstraints } from "@/components/constraints";
import styles from "./teacherView.module.css";
import ChevronDown from "@/assets/chevron-down.svg";
import { useEffect, useState } from "react";
import Link from "next/link";

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
						classObj={classObj}
						studentName={student.name}
						studentId={student.id}
					/>
				);
			})}
		</div>
	);
};

export const StudentItem = ({
	classObj,
	studentName,
	studentId,
}: {
	classObj: any;
	studentName: string;
	studentId: string;
}) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<div
				onClick={() => {
					setOpen(!open);
				}}
				className={styles.studentListItem}
			>
				<p>{studentName}</p>
				<div className={styles.studentListItemAction}>
					<ChevronDown />
				</div>
			</div>
			{open && (
				<MiniTaskList
					classObj={classObj}
					open={open}
					studentId={studentId}
				/>
			)}
		</>
	);
};

export const MiniTaskList = ({
	studentId,
	classObj,
	open,
}: {
	studentId: string;
	classObj: any;
	open: any;
}) => {
	const [tasks, setTasks] = useState([]);

	const id = classObj.id;

	const grabTasks = async () => {
		if (!id) return;
		if (!open) return;
		const work = await fetch(`/api/test/get`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
			body: JSON.stringify({ classID: id, targetUserID: studentId }),
		});

		const workJSON = await work.json();

		setTasks(workJSON.tests);
	};

	useEffect(() => {
		if (Object.keys(classObj).length == 0) {
			return;
		}

		const task = setInterval(() => {
			grabTasks();
		}, 3000);

		grabTasks();
		if (!open) clearInterval(task);
	}, [classObj.id, open]);

	return (
		<div className={styles.studentMiniTaskList}>
			{tasks.map((task: any) => {
				return <MiniTaskItem task={task} key={task.id} />;
			})}
		</div>
	);
};

export const MiniTaskItem = ({ task }: { task: any }) => {
	const [timeRemaining, setTimeRemaining] = useState("");

	useEffect(() => {
		setInterval(() => {
			const endTime = new Date(task.endTime).getTime();
			const newTime = new Date(endTime - Date.now());

			setTimeRemaining(
				`${newTime.getMinutes()}:${newTime
					.getSeconds()
					.toString()
					.padStart(2, "0")}`
			);
		}, 100);
	}, []);

	return (
		<div className={styles.studentMiniTaskItem}>
			<p>
				{task.title} -{" "}
				{task.status.charAt(0).toUpperCase() + task.status.slice(1)}
			</p>
			<div></div>
			<div className={styles.studentListItemAction}>
				{task.status == "ended" && (
					<p>
						{task.questionsCorrect}/{task.questionMax}
					</p>
				)}

				{task.status == "started" && (
					<>
						<p>
							{task.currentQuestion} of {task.questionMax}
						</p>
						<p>{timeRemaining}</p>
					</>
				)}
			</div>
		</div>
	);
};
