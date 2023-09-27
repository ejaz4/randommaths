import styles from "./Login.module.css";

export const LoginDialogue = () => {
  return (
    <div className={styles.dialogue}>
      <div className={styles.text}>
        <h1>Enter your credentials</h1>
        <p>Enter your email address</p>
      </div>

      <input type="email" id="emailInput" />
      <input type="password" id="passwordInput" />
    </div>
  );
};
