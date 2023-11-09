import styles from "./skeleton.module.css"

export const Skeleton = ({
    width,
    height
}: {
    width: any,
    height: any
}) => {
    return <div style={{
        width,
        height,
    }} className={styles.skel}></div>
}