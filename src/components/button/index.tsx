import styles from "./Button.module.css";

export const Button = ({
  children,
  image,
}: {
  children: string;
  image?: any;
}) => {
  return (
    <button className={styles.button}>
      {children}
      {image && image}
    </button>
  );
};
