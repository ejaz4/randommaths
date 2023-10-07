import { useState } from "react";
import { LoginDialogue } from "./login";
import { SignupDialogue } from "./signup";

// This is the authentication form that will handle all types of authentication, such as logging in, logging out and handling password reset requests.
export const AuthenticationDialogue = () => {
  const [currentScreen, setCurrentScreen] = useState("login");

  return (
    <>
      {/* If the currentScreen is equal to login, show the login dialogue */}
      {currentScreen == "login" && (
        <LoginDialogue setScreen={setCurrentScreen} />
      )}
      {/* If the currentScreen is equal to signup, show the signup dialogue */}
      {currentScreen == "signup" && (
        <SignupDialogue setScreen={setCurrentScreen} />
      )}
    </>
  );
};
