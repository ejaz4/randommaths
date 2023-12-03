import styles from "./Header.module.css";
import LogoFull from "../../assets/logo-full.svg";
import { useEffect, useState } from "react";
import { Button } from "../button";
import CrossIcon from "@/assets/x.svg";
import { Minivatar } from "../class/minivatar";
import Pause from "@/assets/pause.svg";
import { useRouter } from "next/router";

export const Header = ({
	screenData,
	screenType,
}: {
	screenData?: any;
	screenType?: string;
}) => {
	const router = useRouter();
	const [time, setTime] = useState(0);
	const [isAbleToEnd, setAbleToEnd] = useState(false);
	const [timeMode, setTimeMode] = useState("elapsed");

	const endExam = async () => {
		console.log("Exam has ended from the header.");
		const testID = screenData.id;

		const endRequest = await fetch(`/api/test/${testID}/update`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
			body: JSON.stringify({
				status: "ended",
			}),
		});

		if (endRequest.status == 200) {
			window.location.href = `/test/${testID}/results`;
		}
	};

	const pauseExam = async () => {
		console.log("Exam has been paused");
		const testID = screenData.id;

		const pauseRequest = await fetch(`/api/test/${testID}/update`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
			body: JSON.stringify({
				status: "break",
				onBreak: true,
			}),
		});

		if (pauseRequest.status == 200) {
			router.push({
				pathname: `/test/[id]/break`,
				query: { id: testID },
			});
		}
	};

	useEffect(() => {
		if (screenData?.endTime) {
			if (
				screenData.status != "incomplete" &&
				screenData.status != "break"
			) {
				if (time <= 0) {
					endExam();
				}
			}
		}
	}, [time]);

	useEffect(() => {
		if (!screenData || !screenData == undefined) return;
		if (Object.keys(screenData).length == 0) return;

		const timerTick = setInterval(() => {
			if (screenData) {
				if (screenData?.endTime) {
					setTime(
						(new Date(screenData?.endTime).getTime() - Date.now()) /
							1000
					);
					setTimeMode("remaining");
				} else {
					setTime(
						(Date.now() -
							new Date(screenData?.startTime).getTime()) /
							1000
					);
					setTimeMode("elapsed");
				}
			}
		}, 100);

		return () => {
			clearInterval(timerTick);
		};
	}, [screenData]);

	return (
		<div className={styles.header}>
			<div>
				{screenData != null && (
					<>
						{timeMode == "elapsed" && (
							<p>
								{Math.floor(time / 60)}:
								{Math.floor(time % 60)
									.toString()
									.padStart(2, "0")}{" "}
								{timeMode}
							</p>
						)}
						{timeMode == "remaining" && (
							<p>
								{Math.floor(time / 60)}:
								{Math.floor(time % 60)
									.toString()
									.padStart(2, "0")}{" "}
								{timeMode}
							</p>
						)}
					</>
				)}

				{screenData == null && <Minivatar />}
			</div>
			<div>
				<LogoFull />
			</div>
			<div
				style={{ display: "flex", justifyContent: "flex-end", gap: 15 }}
			>
				{screenData?.breaksAllowed && (
					<Button onClick={pauseExam} variant="invert">
						<Pause />
					</Button>
				)}
				{screenData?.status == "started" && (
					<>
						<Button
							variant="invert"
							onClick={endExam}
							image={<CrossIcon />}
						>
							End now
						</Button>
					</>
				)}
			</div>
		</div>
	);
};
