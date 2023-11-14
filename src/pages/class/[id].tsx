import { PageConstraints } from "@/components/constraints";
import { ClassCreationDialogue } from "@/components/classCreation";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const ClassView = () => {
	const router = useRouter();

	useEffect(() => {
		
	}, [router.query.id])

	return (
		<PageConstraints>
			<div>
				<h1>Viewing class {router.query.id}</h1>
			</div>

		</PageConstraints>
	);
};

export default ClassView;
