import styles from "./Onboarding.module.css";
import { Button } from "../button";
import { emailRegex } from "@/constants/email";
import { Dialogue } from "../onePageDialogue";

export const StudentDialogue = ({
  name
}: {
  name: string;
} ) => {

  return (
    <Dialogue>
        <div className={styles.text}>
          <h1>Do you have a class to join, {name}?</h1>
          <p>Enter your class code below to join it.</p>
        </div>

        <div className={styles.inputContainer}>
          <div>
            <input id="classInput" type="text" placeholder="ABCD1234"/>
            <p>
              Your teacher or school should have given you a class code. If you didn't join under the advice of your school, you can skip this step.
            </p>
          </div>
        </div>
    </Dialogue>
  );
};
