// Just a glorified router

import { useEffect } from "react";

export const Router = () => {
	useEffect(() => {
		window.location.href = "/dashboard";
	});

	return <></>;
};

export default Router;
