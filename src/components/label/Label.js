import styles from "./Label.module.css";

export default function Label({ variant, type, className, children }) {
  return (
    <div
      className={`${styles.label} ${styles[variant]} ${styles[type]} ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
}
