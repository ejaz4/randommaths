import { Button } from "@/components/button";
import { PageConstraints } from "@/components/constraints";
import { Dialogue } from "@/components/onePageDialogue";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const BreakPage = () => {
	const router = useRouter();
	const [id, setId] = useState("");
	const [results, setResults] = useState<any>([]);

	useEffect(() => {
		setId(router.query.id as string);
	}, [router.query.id]);

	return (
		<PageConstraints>
			<div>
				<h1>On a break</h1>
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
						<Link
							href={{
								pathname: `/test/[id]/question`,
								query: { id: id },
							}}
						>
							<Button>Resume</Button>
						</Link>
					</div>
				}
			>
				<p>
					You're currently on a break. Click Resume to return to
					questions.
				</p>
			</Dialogue>
		</PageConstraints>
	);
};

export default BreakPage;
