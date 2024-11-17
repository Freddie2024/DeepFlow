"use client";

import React, { useEffect, useState } from "react";
import styles from "./TaskForm.module.css";

function getLocalISOString(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    console.error("Invalid date passed to getLocalISOString:", date);
    return null;
  }
  const offset = date.getTimezoneOffset() * 60000;
  const localISOString = new Date(date.getTime() - offset)
    .toISOString()
    .split("T")[0];

  return localISOString;
}

function determineDueOption(dueDate) {
  if (dueDate === null || dueDate === undefined) return "someday";

  const formattedDueDate = getLocalISOString(new Date(dueDate));

  const today = getLocalISOString(new Date());

  const tomorrow = (() => {
    const temp = new Date();
    temp.setDate(temp.getDate() + 1);
    return getLocalISOString(temp);
  })();

  if (formattedDueDate === today) return "today";
  if (formattedDueDate === tomorrow) return "tomorrow";

  return "later";
}

export default function TaskForm({
  onSubmit,
  defaultData = {},
  disabledPriorities = [],
  isEditing = false,
  onCancel,
}) {
  const [dueOption, setDueOption] = useState(
    isEditing
      ? determineDueOption(getLocalISOString(new Date(defaultData.dueDate)))
      : "today"
  );

  const [priority, setPriority] = useState(defaultData.priority || "");
  const [confirmNoDate, setConfirmNoDate] = useState(false);

  useEffect(() => {
    setConfirmNoDate(false);
  }, []);

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

    let dueDate = null;

    if (dueOption === "later") {
      dueDate = taskData.dueDate || null;
    } else if (dueOption === "today") {
      dueDate = getLocalISOString(new Date());
    } else if (dueOption === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      dueDate = getLocalISOString(tomorrow);
    } else if (dueOption === "someday" && confirmNoDate) {
      dueDate = null;
    } else {
      alert(
        "Please confirm that you want to add this task without a due date."
      );
      return;
    }

    taskData.dueDate = dueDate;

    if (isEditing) {
      onSubmit(taskData);
    } else {
      const dueDateInput = document.createElement("input");
      dueDateInput.type = "hidden";
      dueDateInput.name = "dueDate";
      dueDateInput.value = dueDate || "";
      event.target.appendChild(dueDateInput);
      onSubmit(event);
    }
  }

  function handleDueOptionChange(option) {
    setDueOption(option);
    if (option !== "someday") {
      setConfirmNoDate(false);
    }
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
              disabled={disabledPriorities.includes("long")}
              required
            />
            <label
              htmlFor="long"
              className={
                disabledPriorities.includes("long") ? styles.disabled : " "
              }
            >
              3 hours
              {/* {disabledPriorities.includes("long")} */}
            </label>
            <br />
            <input
              type="radio"
              name="priority"
              id="medium"
              value="medium"
              checked={priority === "medium"}
              onChange={() => setPriority("medium")}
              disabled={disabledPriorities.includes("medium")}
            />
            <label
              htmlFor="medium"
              className={
                disabledPriorities.includes("medium") ? styles.disabled : " "
              }
            >
              1 hour
            </label>
            <br />
            <input
              type="radio"
              name="priority"
              id="short"
              value="short"
              checked={priority === "short"}
              onChange={() => setPriority("short")}
              disabled={disabledPriorities.includes("short")}
            />
            <label
              htmlFor="short"
              className={
                disabledPriorities.includes("short") ? styles.disabled : " "
              }
            >
              20 minutes
              {/* {disabledPriorities.includes("short") && " (limit reached)"} */}
            </label>
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
              onChange={() => handleDueOptionChange("later")}
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
                    ? getLocalISOString(new Date(defaultData.dueDate))
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
