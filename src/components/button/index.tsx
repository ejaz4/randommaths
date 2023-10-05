import styles from "./Button.module.css";

// This is a standard button component that can be used anywhere in the app
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
    <button onClick={onClick} className={styles.button}>
      {children}
      {image && image}
    </button>
  );
};
