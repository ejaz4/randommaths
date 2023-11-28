import { PageConstraints } from "@/components/constraints";
import { AuthenticationDialogue } from "@/components/authentication";
import { useEffect } from "react";
import { ActOnVerify } from "@/components/authentication/sdk";

export const DashboardScreen = () => {
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
					window.location.href = "/test/selection";
				} else {
					window.location.href = "/auth";
				}
			});
		}
	}, []);
	return (
		<PageConstraints>
			<div>
				<p>Routing you correctly...</p>
			</div>
		</PageConstraints>
	);
};

export default DashboardScreen;
