import styles from "./Login.module.css";
import { Button } from "../button";
import LoginIcon from "../../assets/log-in.svg";
import UserPlus from "../../assets/user-plus.svg";
import { emailRegex } from "@/constants/email";

export const LoginDialogue = ({ setScreen }: { setScreen: any }) => {
  const inputValidation = () => {
    const emailInput = document.getElementById(
      "emailInput"
    ) as HTMLInputElement;
    const passwordInput = document.getElementById(
      "passwordInput"
    ) as HTMLInputElement;

    const emailAddress = emailInput.value;
    const password = passwordInput.value;

    var valid = {
      email: true,
      password: true,
    };

    if (emailAddress.trim() == "") valid.email = false;
    if (!emailRegex.test(emailAddress)) valid.email = false;
    if (password.length < 8) valid.password = false;

    if (!valid.email) {
      emailInput.classList.add(styles.invalid);
      emailInput.classList.add(styles.invalidAnimation);

      emailInput.addEventListener("animationend", () => {
        emailInput.classList.remove(styles.invalidAnimation);
      });
    }

    if (!valid.password) {
      passwordInput.classList.add(styles.invalid);
      passwordInput.classList.add(styles.invalidAnimation);

      passwordInput.addEventListener("animationend", () => {
        passwordInput.classList.remove(styles.invalidAnimation);
      });
    }

    if (valid.email && valid.password) {
      emailInput.classList.remove(styles.invalid);
      passwordInput.classList.remove(styles.invalid);

      alert("It works!");
    }
  };

  return (
    <div className={styles.outerDialogue}>
      <div className={styles.dialogue}>
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
      </div>

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
    </div>
  );
};
