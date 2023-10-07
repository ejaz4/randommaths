import styles from "./Login.module.css";
import { Button } from "../button";
import LoginIcon from "../../assets/log-in.svg";
import UserPlus from "../../assets/user-plus.svg";
import ChevronRight from "../../assets/chevron-right.svg";
import { emailRegex } from "@/constants/email";

export const SignupDialogue = ({ setScreen }: { setScreen: any }) => {
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
          <h1>Welcome to RandomMaths</h1>
          <p>
            RandomMaths is the ultimate mathematics platform for students aged
            13-16.
          </p>
        </div>

        <div className={styles.inputContainer}>
          <div>
            <p>Enter your email address</p>
            <input type="email" id="emailInput" className={styles.loginInput} />
            <p>
              Please use your personal email address to sign up for RandomMaths
            </p>
          </div>

          <div>
            <p>Choose a passphrase</p>
            <input
              type="password"
              id="passwordInput"
              minLength={8}
              className={styles.loginInput}
            />

            <p>Confirm your passphrase</p>
            <input
              type="passwordConfirm"
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
              setScreen("login");
            }}
            image={<LoginIcon />}
          >
            Log In
          </Button>
        </div>
        <div>
          <Button onClick={inputValidation} image={<ChevronRight />}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
