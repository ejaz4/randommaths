import { PageConstraints } from "@/components/constraints";
import { ClassCreationDialogue } from "@/components/class/classCreation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ClassManagement, TeacherView } from "@/components/class/teacherView";

export const ClassView = () => {
	const router = useRouter();
	const [classDetails, setClassDetails] = useState({});
	const [screen, setScreen] = useState("skeleton");

	useEffect(() => {
		async function fetchData() {
			const userFetch = await fetch("/api/user", {
				headers: {
					authorization: localStorage.getItem("token") as string,
				},
			});

			if (userFetch.status != 200) {
				return (window.location.href = "/auth");
			}

			const classFetch = await fetch(
				`/api/class/${router.query.id}/details`,
				{
					headers: {
						authorization: localStorage.getItem("token") as string,
					},
				}
			);

			if (classFetch.status == 200) {
				setClassDetails(await classFetch.json());
				const user = (await userFetch.json()).user;

				if (user.type == "teacher") {
					setScreen("teacherView");
				}

				if (user.type == "student") {
					setScreen("studentView");
				}
			} else {
				return alert("There was an issue processing this request.");
			}
		}

		if (router.query.id) {
			fetchData();
		}
	}, [router.query.id]);

	return (
		<PageConstraints>
			<ClassManagement screen={screen} classObj={classDetails} />
		</PageConstraints>
	);
};

export default ClassView;
