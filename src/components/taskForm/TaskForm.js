import React, { useEffect } from "react";
import styles from "./TaskForm.module.css";
import { useState } from "react";

export default function TaskForm({ onSubmit, defaultData = {} }) {
  const [dueOption, setDueOption] = useState("today");
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
    event.preventDefault();
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
    onSubmit(taskData);
  }

  function handleDueOptionChange(option) {
    setDueOption(option);
    setConfirmNoDate(false);
  }

  return (
    <>
      <form className={styles.form} aria-label="Task Form" onSubmit={onSubmit}>
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
              defaultChecked={defaultData?.priority === "long"}
              required
            />
            <label htmlFor="long"> 3 hours</label> <br />
            <input type="radio" name="priority" id="medium" value="medium" />
            <label htmlFor="medium"> 1 hour</label> <br />
            <input type="radio" name="priority" id="short" value="short" />
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
              defaultChecked={defaultData?.dueDate === "today"}
              required
            />
            <label htmlFor="today"> Today</label> <br />
            <input
              type="radio"
              name="dueOption"
              id="tomorrow"
              value="tomorrow"
              onChange={() => handleDueOptionChange("tomorrow")}
            />
            <label htmlFor="tomorrow"> Tomorrow</label> <br />
            <input
              type="radio"
              name="dueOption"
              id="laterDate"
              value="laterDate"
              onChange={() => handleDueOptionChange("laterDate")}
            />
            <label htmlFor="laterDate"> Later Date</label> <br />
            {dueOption === "laterDate" && (
              <input
                type="date"
                name="dueDate"
                className={styles.formInput}
                defaultValue={defaultData?.dueDate || ""}
              />
            )}
            <input
              type="radio"
              name="dueOption"
              id="someday"
              value="someday"
              onChange={() => handleDueOptionChange("someday")}
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
              Are you sure you don't want to set a date?
            </label>
          </div>
        )}
        <button
          className={styles.submitButton}
          type="submit"
          disabled={dueOption === "someday" && !confirmNoDate}
        >
          Add task
        </button>
      </form>
    </>
  );
}
