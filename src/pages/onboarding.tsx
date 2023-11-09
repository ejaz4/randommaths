import { PageConstraints } from "@/components/constraints";
import { OnboardingDialogue } from "@/components/onboarding";

export const OnboardingScreen = () => {
	return (
		<PageConstraints>
			<div>
				<h1>Getting Started</h1>
			</div>
			<OnboardingDialogue></OnboardingDialogue>
		</PageConstraints>
	);
};

export default OnboardingScreen;
