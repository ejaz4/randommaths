// This function logs out the user.
export const logout = async () => {
	// Remove the token from the local storage
	localStorage.removeItem("token");

	// Refresh the page, if the user is on a protected page, the page will handle that instead.
	window.location.reload();

	// Future support for removing the token with the server also planned.
};

export const verify = async () => {
	// Get the token from the local storage
	const token = localStorage.getItem("token");

	// If there is no token, return false
	if (!token) return false;

	// Send a request to the server to verify the token
	const response = await fetch("/api/verify", {
		method: "GET",
		headers: {
			authorization: token,
		},
	});

	// If the response is not 200, return false
	if (response.status !== 200) return false;

	// Return true
	return true;
};

export const ActOnVerify = async () => {
	const verified = await verify();

	if (!verified) {
		window.location.href = "/auth";
	}
};
