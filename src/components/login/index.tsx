import styles from "./Login.module.css";
import { Button } from "../button";
import LoginIcon from "../../assets/log-in.svg"
import { emailRegex } from "@/constants/email";

export const LoginDialogue = () => {
  const inputValidation = () => {
    const emailInput = document.getElementById("emailInput") as HTMLInputElement;
    const passwordInput = document.getElementById("passwordInput") as HTMLInputElement;

    const emailAddress = emailInput.value;
    const password = passwordInput.value;
    
    var valid = {
      email: true,
      password: true
    };

    if (emailAddress.trim() == "") valid.email = false
    if (!emailRegex.test(emailAddress)) valid.email = false
    if (password.length < 8) valid.password = false

    if (!valid.email) {
      emailInput.classList.add(styles.invalid)
    }

    if (!valid.password) {
      passwordInput.classList.add(styles.invalid)
    }

    if (valid.email && valid.password) {
      emailInput.classList.remove(styles.invalid);
      passwordInput.classList.remove(styles.invalid);

      alert("It works!")
    }
  }

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
        <Button onClick={inputValidation} image={<LoginIcon/>}>Log In</Button>
      </div>
    </div>
    </>
  );
};
