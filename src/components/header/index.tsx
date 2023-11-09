import styles from "./Header.module.css";
import LogoFull from "../../assets/logo-full.svg";

export const Header = () => {
  return (
    <div className={styles.header}>
      <div>
        <h1></h1>
      </div>
      <div>
        <LogoFull />
      </div>
      <div>
        <h1></h1>
      </div>
    </div>
  );
};
