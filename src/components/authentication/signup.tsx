import styles from "./Login.module.css";
import { Button } from "../button";
import LoginIcon from "../../assets/log-in.svg";
import UserPlus from "../../assets/user-plus.svg";
import ChevronRight from "../../assets/chevron-right.svg";
import { emailRegex } from "@/constants/email";
import { useState } from "react";

export const SignupDialogue = ({ setScreen }: { setScreen: any }) => {
  const [isTeacher, setIsTeacher] = useState(false);

  const checkTeacher = (e: any) => {
    if (e.target.value == "teacher") {
      setIsTeacher(true);
    } else {
      setIsTeacher(false);
    }
  }

  const inputValidation = () => {
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
            13-16
          </p>
        </div>

        <div className={styles.inputContainer}>
          <div>
            <p>Enter your full name</p>
            <input type="text" id="nameInput" className={styles.loginInput} />
            <p>
              Use your full name as it would typically appear on school registers
            </p>
          </div>

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
              type="password"
              id="passwordConfirm"
              minLength={8}
              className={styles.loginInput}
            />
          </div>


          <div>
            <p>What best describes you?</p>
            <select onChange={checkTeacher}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>

            {isTeacher && (
              <div>
                <input type="checkbox" name="teacherAgreement" id="teacherAgreement" />
                <label htmlFor="teacherAgreement">I confirm that this is my only account and that my school or institution has not created another account for me.</label>
              </div>
            )}
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
