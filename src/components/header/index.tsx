import styles from "./Header.module.css";
import LogoFull from "../../assets/logo-full.svg";
import { useEffect, useState } from "react";
import { Button } from "../button";
import CrossIcon from "@/assets/x.svg";
import { Minivatar } from "../class/minivatar";

export const Header = ({
	screenData,
	screenType,
}: {
	screenData?: any;
	screenType?: string;
}) => {
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

	useEffect(() => {
		console.log("Screen data updated", screenData);
	}, [screenData]);

	useEffect(() => {
		if (screenData?.endTime) {
			if (time <= 0) {
				endExam();
			}
		}
	}, [time]);

	useEffect(() => {
		console.log("SD", screenData);
		if (!screenData || !screenData == undefined) return;
		if (Object.keys(screenData).length == 0) return;

		console.log("SD PASSED", Object.keys(screenData).length);

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
			<div>
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
