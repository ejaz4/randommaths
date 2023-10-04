import styles from "./Button.module.css";

export const Button = ({
  children,
  image,
  onClick,
}: {
  children: string;
  image?: any;
  onClick?: () => void;
}) => {

  return (
    <button className={styles.button}>
      {children}
      {image && image}
    </button>
  );
};
