import styles from "./Login.module.css";
import { Button } from "../button";
import LoginIcon from "../../assets/log-in.svg";
import UserPlus from "../../assets/user-plus.svg";
import { emailRegex } from "@/constants/email";
import { Dialogue } from "../onePageDialogue";

export const LoginDialogue = ({ setScreen }: { setScreen: any }) => {
  const inputValidation = async() => {
    // Get the email and password inputs
    const emailInput = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;

    // Get the values of the inputs
    const emailAddress = emailInput.value;
    const password = passwordInput.value;

    // Create an object to store the validity of the inputs, they are true until proven false.
    var valid = {
      email: true,
      password: true,
    };

    
    // Check if the email address is empty or if it doesn't match the email regex
    if (emailAddress.trim() == "") valid.email = false;

    // Check if the password is less than 8 characters
    if (!emailRegex.test(emailAddress)) valid.email = false;

    // Check if the password is less than 8 characters
    if (password.length < 8) valid.password = false;

    // If the email address is invalid, add the invalid class and the animation class
    if (!valid.email) {
      emailInput.classList.add(styles.invalid);
      emailInput.classList.add(styles.invalidAnimation);

      emailInput.addEventListener("animationend", () => {
        emailInput.classList.remove(styles.invalidAnimation);
      });
    }
    
    // If the password is invalid, add the invalid class and the animation class
    if (!valid.password) {
      passwordInput.classList.add(styles.invalid);
      passwordInput.classList.add(styles.invalidAnimation);

      passwordInput.addEventListener("animationend", () => {
        passwordInput.classList.remove(styles.invalidAnimation);
      });
    }

    // If both the email and password are valid, remove the invalid class
    if (valid.email && valid.password) {
      emailInput.classList.remove(styles.invalid);
      passwordInput.classList.remove(styles.invalid);

      // Send the data to the server
      const loginRequest = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailAddress,
          password: password,
        }),
      });

      // Check if the request was successful
      if (loginRequest.status == 200) {
        const loginResponse = await loginRequest.json();
        // Store the token in the local storage
        localStorage.setItem("token", loginResponse.token);

        // Redirect the user to the dashboard
        window.location.href = "/dashboard";
      }
    }
  };

  return (
    <Dialogue footer={
      <div className={styles.buttonContainer}>
      <div>
        <Button
          onClick={() => {
            setScreen("signup");
          }}
          image={<UserPlus />}
        >
          Sign Up
        </Button>
      </div>
      <div>
        <Button onClick={inputValidation} image={<LoginIcon />}>
          Log In
        </Button>
      </div>
    </div>
    }>
        <div className={styles.text}>
          <h1>Enter your credentials</h1>
          <p>Enter your email address</p>
        </div>

        <div className={styles.inputContainer}>
          <div>
            <input type="email" id="emailInput" className={styles.loginInput} />
            <p>
              This is typically the email address you used to sign up to
              RandomMaths. In some cases this can be your school email address.
            </p>
          </div>

          <div>
            <p>Enter your passphrase</p>
            <input
              type="password"
              id="passwordInput"
              minLength={8}
              className={styles.loginInput}
            />
          </div>
        </div>
      </Dialogue>
  );
};
