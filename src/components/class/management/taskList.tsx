import { PageConstraints } from "@/components/constraints";
import styles from "./teacherView.module.css";
import ChevronDown from "@/assets/chevron-down.svg";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button } from "@/components/button";
import Link from "next/link";

export const TaskList = () => {
	const router = useRouter();

	const [tasks, setTasks] = useState([]);

	const grabTasks = async () => {
		const classID = router.query.id;

		const work = await fetch(`/api/test/get`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
			body: JSON.stringify({ classID }),
		});

		const workJSON = await work.json();

		setTasks(workJSON.tests);
	};

	useEffect(() => {
		if (!router.query.id) return;

		setInterval(() => {
			grabTasks();
		}, 3000);

		grabTasks();
	}, [router.query.id]);

	return (
		<div className={styles.studentList}>
			{tasks.map((task: any) => {
				return <TaskItem task={task} key={task.id} />;
			})}

			{tasks.length == 0 && (
				<p style={{ padding: 10, textAlign: "center" }}>
					Your teacher hasn't set you any tasks yet 😭.<br></br>
					Try some tasks out yourself or review your weaknesses
					instead.
				</p>
			)}
		</div>
	);
};

export const TaskItem = ({ task }: { task: any }) => {
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
		<div className={styles.studentListItem}>
			<p>
				{task.title} -{" "}
				{task.status.charAt(0).toUpperCase() + task.status.slice(1)}
			</p>
			<div></div>
			<div className={styles.studentListItemAction}>
				{task.status == "incomplete" && (
					<Link
						href={{
							pathname: `/test/[id]/question`,
							query: {
								id: task.id,
							},
						}}
					>
						<Button variant="invert">Start</Button>
					</Link>
				)}

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
						<Link
							href={{
								pathname: `/test/[id]/question`,
								query: {
									id: task.id,
								},
							}}
						>
							<Button variant="invert">Join Here</Button>
						</Link>
					</>
				)}
			</div>
		</div>
	);
};
