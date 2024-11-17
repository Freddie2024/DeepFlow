import styles from "./Button.module.css";

export default function Button({
  variant = "primary",
  as: Component = "button",
  children,
  ...props
}) {
  return (
    <Component className={`${styles.button} ${styles[variant]}`} {...props}>
      {children}
    </Component>
  );
}
