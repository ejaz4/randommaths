import styles from "./PageConstraints.module.css"

export const PageConstraints = ({ children }: { children: any }) => {
  return <div className={styles.pageConstraints}>{children}</div>;
};
