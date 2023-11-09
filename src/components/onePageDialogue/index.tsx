import styles from "./Dialogue.module.css"

export const Dialogue = ({
    children,
    footer
}: {
    children: any,
    footer?: any
}) => {
    return (
        <div className={styles.outerDialogue}>
            <div className={styles.dialogue}>
                {children}
            </div>

            {footer}
        </div>
    )
}