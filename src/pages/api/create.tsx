import { PageConstraints } from "@/components/constraints";
import { ClassCreationDialogue } from "@/components/classCreation";

export const ClassCreation = () => {
	return (
		<PageConstraints>
			<div>
				<h1>Create class</h1>
			</div>

			<ClassCreationDialogue />
		</PageConstraints>
	);
};

export default ClassCreation;
