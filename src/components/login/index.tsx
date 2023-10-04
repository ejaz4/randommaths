import styles from "./Login.module.css";
import { Button } from "../button";
import LoginIcon from "../../assets/log-in.svg"

export const LoginDialogue = () => {
  return (
    <>
    <div className={styles.dialogue}>
      <div className={styles.text}>
        <h1>Enter your credentials</h1>
        <p>Enter your email address</p>
      </div>

      <div className={styles.inputContainer}>
        <div>
          <input type="email" id="emailInput" />
          <p>This is typically the email address you used to sign up to RandomMaths. In some cases this can be your school email address.</p>
        </div>

        <div>
          <p>Enter your passphrase</p>
          <input type="password" id="passwordInput" />
        </div>
      </div>
    </div>

    <div className={styles.buttonContainer}>
      <div></div>
      <div>
        <Button image={<LoginIcon/>}>Log In</Button>
      </div>
    </div>
    </>
  );
};
