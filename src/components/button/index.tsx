import styles from "./Button.module.css";

export const Button = ({
    children
}: {
    children: string
}) => {
    return (
        <button className={styles.button}>{children}</button>
    );
};
