import { Button } from "@/components/button";
import { PageConstraints } from "@/components/constraints";
import { Dialogue } from "@/components/onePageDialogue";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const Results = () => {
	const router = useRouter();
	const [id, setId] = useState("");
	const [results, setResults] = useState<any>([]);

	const fetchResults = async () => {
		const id = router.query.id;

		if (!id) {
			return;
		}
		const results = await fetch(`/api/test/${id}/latest`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				authorization: localStorage.getItem("token") as string,
			},
		});

		if (results.status == 200) {
			const resultsData = await results.json();
			setResults(resultsData);
		}
	};

	useEffect(() => {
		setId(router.query.id as string);
		fetchResults();
	}, [router.query.id]);

	return (
		<PageConstraints>
			<div>
				<h1>Results</h1>
			</div>

			<Dialogue
				footer={
					<div
						style={{
							display: "flex",
							justifyContent: "flex-end",
							gap: "10px",
							marginTop: "10px",
						}}
					>
						<Link href="/dashboard">
							<Button>Dashboard</Button>
						</Link>
					</div>
				}
			>
				<h1>
					{results.title} - {results.questionsCorrect}/
					{results.questionMax}
				</h1>
				<p>This test has just {results.status}.</p>
				<p>
					Tip: You can review weaknesses from the button in the
					dashboard. It instantly starts a test with all your strong
					and weak sub-topics without introducing new ones 💪.
				</p>
			</Dialogue>
		</PageConstraints>
	);
};

export default Results;
