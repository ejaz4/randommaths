import { Button } from "@/components/button";
import styles from "./teacherView.module.css";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/router";
import WalkOut from "@/assets/loader.svg";

export const TeacherActions = ({ classObj }: { classObj: any }) => {
	const router = useRouter();

	return (
		<div className={styles.buttonContainer}>
			<Link
				href={{
					pathname: "/test/selection",
					query: {
						classId: router.query.id,
					},
				}}
			>
				<Button>Set work</Button>
			</Link>
		</div>
	);
};

export const StudentActions = ({ classObj }: { classObj: any }) => {
	const router = useRouter();

	return (
		<div className={styles.buttonContainer}>
			<Button image={<WalkOut />}>Leave class</Button>
		</div>
	);
};
