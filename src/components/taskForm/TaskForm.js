import React, { useEffect, useState } from "react";
import styles from "./TaskForm.module.css";

function determineDueOption(dueDate) {
  if (!dueDate) return "someday";

  const formattedDueDate = new Date(dueDate).toISOString().split("T")[0];
  const today = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(new Date().setDate(new Date().getDate() + 1))
    .toISOString()
    .split("T")[0];

  if (formattedDueDate === today) return "today";
  if (formattedDueDate === tomorrow) return "tomorrow";
  return "later";
}

export default function TaskForm({
  onSubmit,
  defaultData = {},
  isEditing = false,
  onCancel,
}) {
  const [dueOption, setDueOption] = useState(
    determineDueOption(defaultData.dueDate)
  );
  const [priority, setPriority] = useState(defaultData.priority || "long");
  const [confirmNoDate, setConfirmNoDate] = useState(false);

  useEffect(() => {
    const textarea = document.getElementById("description");

    function autoResize() {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    textarea.addEventListener("input", autoResize);

    return () => textarea.removeEventListener("input", autoResize);
  }, []);

  function handleSubmit(event) {
    if (!isEditing) event.preventDefault();
    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData);

    let dueDate;
    if (dueOption === "later") {
      dueDate = taskData.dueDate || null;
    } else if (dueOption === "today") {
      dueDate = new Date().toISOString().split("T")[0];
    } else if (dueOption === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = tomorrow.toISOString().split("T")[0];
    } else if (dueOption === "someday" && confirmNoDate) {
      dueDate = null;
    } else {
      alert(
        "Please confirm that you want to add this task without a due date."
      );
      return;
    }

    taskData.dueDate = dueDate;

    onSubmit(isEditing ? taskData : event);
  }

  function handleDueOptionChange(option) {
    setDueOption(option);
    setConfirmNoDate(option === "someday");
  }

  return (
    <>
      <form
        className={styles.form}
        aria-label="Task Form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="title">Title: </label> <br />
        <input
          id="title"
          name="title"
          type="text"
          required
          className={styles.formInput}
          defaultValue={defaultData?.title}
        />{" "}
        <br />
        <label htmlFor="description">Description: </label> <br />
        <textarea
          id="description"
          name="description"
          rows="2"
          maxLength="500"
          className={styles.formInput}
          defaultValue={defaultData?.description}
        />
        <section className={styles.radioGroups}>
          <div className={styles.radioGroup}>
            <p>Duration:</p>
            <input
              type="radio"
              name="priority"
              id="long"
              value="long"
              checked={priority === "long"}
              onChange={() => setPriority("long")}
              required
            />
            <label htmlFor="long"> 3 hours</label> <br />
            <input
              type="radio"
              name="priority"
              id="medium"
              value="medium"
              checked={priority === "medium"}
              onChange={() => setPriority("medium")}
            />
            <label htmlFor="medium"> 1 hour</label> <br />
            <input
              type="radio"
              name="priority"
              id="short"
              value="short"
              checked={priority === "short"}
              onChange={() => setPriority("short")}
            />
            <label htmlFor="short"> 20 minutes</label>
          </div>
          <div className={styles.radioGroup}>
            <p>Due:</p>
            <input
              type="radio"
              name="dueOption"
              id="today"
              value="today"
              onChange={() => handleDueOptionChange("today")}
              checked={dueOption === "today"}
              required
            />
            <label htmlFor="today"> Today</label> <br />
            <input
              type="radio"
              name="dueOption"
              id="tomorrow"
              value="tomorrow"
              onChange={() => handleDueOptionChange("tomorrow")}
              checked={dueOption === "tomorrow"}
            />
            <label htmlFor="tomorrow"> Tomorrow</label> <br />
            <input
              type="radio"
              name="dueOption"
              id="later"
              value="later"
              onChange={() => handleDueOptionChange("")}
              checked={dueOption === "later"}
            />
            <label htmlFor="later"> Later Date</label> <br />
            {dueOption === "later" && (
              <input
                type="date"
                name="dueDate"
                className={styles.formInput}
                defaultValue={
                  defaultData?.dueDate
                    ? new Date(defaultData.dueDate).toISOString().split("T")[0]
                    : ""
                }
              />
            )}
            <input
              type="radio"
              name="dueOption"
              id="someday"
              value="someday"
              onChange={() => handleDueOptionChange("someday")}
              checked={dueOption === "someday"}
            />
            <label htmlFor="someday"> Someday</label> <br />
          </div>
        </section>
        {dueOption === "someday" && (
          <div className={styles.confirmNoDate}>
            <label>
              <input
                type="checkbox"
                checked={confirmNoDate}
                onChange={() => setConfirmNoDate(!confirmNoDate)}
              />
              Save this task without a specific date?
            </label>
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button
            className={styles.submitButton}
            type="submit"
            disabled={dueOption === "someday" && !confirmNoDate}
          >
            {isEditing ? "Save" : "Add Task"}
          </button>
          {/* <button
            type="button"
            className={styles.cancelButton}
            onClick={onCancel}
          >
            Cancel
          </button> */}
        </div>
      </form>
    </>
  );
}
