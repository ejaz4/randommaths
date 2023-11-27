import { useEffect, useState } from "react";
import { Dialogue } from "../../onePageDialogue";
import { ActOnVerify } from "../../authentication/sdk";
import styles from "./ClassCreation.module.css";
import { Button } from "../../button";

import Plus from "@/assets/plus.svg";

export const ClassCreationDialogue = () => {
	const [name, setName] = useState("");

	useEffect(() => {
		const token = localStorage.getItem("token");
		ActOnVerify();

		if (token) {
			fetch("/api/user", {
				headers: {
					authorization: localStorage.getItem("token") as string,
				},
			}).then((response) => {
				if (response.status == 200) {
					response.json().then((data) => {
						setName(data.user.name);
					});
				} else {
					window.location.href = "/auth";
				}
			});
		}
	}, []);

	const createClass = async () => {
		const className = (
			document.getElementById("className") as HTMLInputElement
		).value.trim();
		let acceptedClassName = `${name.split(" ")[0].slice(0, 1)} ${
			name.split(" ")[1]
		}'s class`;

		if (className != "") {
			acceptedClassName = className;
		}

		const token = localStorage.getItem("token");

		const createRequest = await fetch("/api/class/create", {
			method: "POST",
			headers: {
				authorization: token as string,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				name: acceptedClassName,
			}),
		});

		if (createRequest.status == 200) {
			return (window.location.href = `/class/${
				(await createRequest.json()).classId
			}`);
		} else {
			return alert(
				"An error occured while creating your class. Please try again later."
			);
		}
	};

	return (
		<Dialogue
			footer={
				<div className={styles.buttonContainer}>
					<div></div>
					<div>
						<Button onClick={createClass} image={<Plus />}>
							Create
						</Button>
					</div>
				</div>
			}
		>
			<div style={{ width: "100%" }}>
				<h1>{name.split(" ")[0]}, let&apos;s get your class set up</h1>
				<p>
					To get started, we need to know a bit about your class.
					Don&apos;t worry, you can change this later.
				</p>

				<p>Name your class</p>
				<input
					type="text"
					id="className"
					placeholder={`${name.split(" ")[0].slice(0, 1)} ${
						name.split(" ")[1]
					}'s class`}
				/>
			</div>
		</Dialogue>
	);
};
