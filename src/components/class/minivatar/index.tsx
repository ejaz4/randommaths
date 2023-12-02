import { useEffect, useState } from "react";
import styles from "./minivatar.module.css";
import Link from "next/link";

export const Minivatar = () => {
	const [className, setClassName] = useState<any>(null);
	const [classId, setClassId] = useState<any>(null);
	const [shown, setShown] = useState<boolean>(false);

	const userFetch = async () => {
		const user = await fetch("/api/user", {
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
		});

		if (user.status == 200) {
			const userData = await user.json();
			if (userData.user.type == "teacher") {
				if (userData.user.ClassAndOwner) {
					setClassName(userData.user.ClassAndOwner[0].class.name);
					setClassId(userData.user.ClassAndOwner[0].class.id);
					setShown(true);
				} else {
					setShown(false);
				}
			} else {
				if (userData.user.class) {
					setClassName(userData.user.class.name);
					setClassId(userData.user.class.id);
					setShown(true);
				} else {
					setShown(false);
				}
			}
		}
	};

	useEffect(() => {
		userFetch();
	}, []);

	return (
		<>
			{shown && (
				<Link href={`/class/${classId}`}>
					<div className={styles.minivatar}>
						<p>{className}</p>
					</div>
				</Link>
			)}
		</>
	);
};
