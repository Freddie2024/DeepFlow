import styles from "../components/taskForm/TaskForm.module.css";
import Swal from "sweetalert2";

export async function showWarning(title, message) {
  const result = await Swal.fire({
    title: title,
    text: message,
    icon: "warning",
    iconColor: "var(--accent)",
    showCancelButton: true,
    confirmButtonText: "Continue Anyway",
    cancelButtonText: "Cancel",
    backdrop: false,
    customClass: {
      popup: styles.customPopup,
      confirmButton: styles.confirmButton,
      cancelButton: styles.cancelButton,
      title: styles.warningTitle,
      icon: styles.warningIcon,
    },
  });
  return result.isConfirmed;
}

export async function showSuccess(title, message) {
  await Swal.fire({
    title: title,
    text: message,
    icon: null,
    iconColor: "var(--accent)",
    timer: 5000,
    timerProgressBar: true,
    showConfirmButton: false,
    backdrop: false,
    allowOutsideClick: true,
    customClass: {
      popup: styles.customPopup,
      title: styles.warningTitle,
      icon: styles.warningIcon,
    },
    didOpen: (popup) => {
      popup.style.display = "flex";
      popup.style.opacity = "1";
    },
  });
}
