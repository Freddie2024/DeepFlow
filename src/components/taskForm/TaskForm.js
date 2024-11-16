"use client";

import React, { useEffect, useState } from "react";
import styles from "./TaskForm.module.css";

function getLocalISOString(date) {
  console.log("getLocalISOString - Input date:", date);

  if (!(date instanceof Date) || isNaN(date)) {
    console.error("Invalid date passed to getLocalISOString:", date);
    return null;
  }
  const offset = date.getTimezoneOffset() * 60000;
  const localISOString = new Date(date.getTime() - offset)
    .toISOString()
    .split("T")[0];

  console.log("getLocalISOString - Output:", localISOString);
  return localISOString;

  // return new Date(date.getTime() - offset).toISOString().split("T")[0];
}

console.log("Today's Local ISO String:", getLocalISOString(new Date()));

function determineDueOption(dueDate) {
  console.log("determineDueOption - Input dueDate:", dueDate);

  if (dueDate === null || dueDate === undefined) return "someday";

  // const formattedDueDate = new Date(dueDate).toISOString().split("T")[0];
  const formattedDueDate = getLocalISOString(new Date(dueDate));

  // const today = new Date().toISOString().split("T")[0];
  const today = getLocalISOString(new Date());

  const tomorrow = (() => {
    const temp = new Date();
    temp.setDate(temp.getDate() + 1);
    // return temp.toISOString().split("T")[0];
    return getLocalISOString(temp);
  })();

  console.log("determineDueOption - Today:", today);
  console.log("determineDueOption - Tomorrow:", tomorrow);
  console.log("determineDueOption - Formatted Due Date:", formattedDueDate);

  if (formattedDueDate === today) return "today";
  if (formattedDueDate === tomorrow) return "tomorrow";

  return "later";
}

export default function TaskForm({
  onSubmit,
  defaultData = {},
  isEditing = false,
  onCancel,
  // defaultDueOption = "today",
}) {
  const [dueOption, setDueOption] = useState(
    isEditing
      ? // && defaultData.dueDate !== undefined
        determineDueOption(getLocalISOString(new Date(defaultData.dueDate)))
      : "today"
  );

  console.log("Render - dueOption (initial):", dueOption);
  console.log("Render - defaultData.dueDate:", defaultData.dueDate);

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
    console.log("handleSubmit triggered");
    event.preventDefault();

    console.log("handleSubmit - Selected dueOption:", dueOption);

    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData);

    let dueDate = null;

    if (dueOption === "later") {
      dueDate = taskData.dueDate || null;
    } else if (dueOption === "today") {
      // dueDate = new Date().toISOString().split("T")[0];
      dueDate = getLocalISOString(new Date());
    } else if (dueOption === "tomorrow") {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      // dueDate = tomorrow.toISOString().split("T")[0];
      dueDate = getLocalISOString(tomorrow);
    } else if (dueOption === "someday" && confirmNoDate) {
      dueDate = null;
    } else {
      alert(
        "Please confirm that you want to add this task without a due date."
      );
      return;
    }

    console.log("handleSubmit - Calculated dueDate:", dueDate);

    taskData.dueDate = dueDate;

    console.log("handleSubmit - Final taskData:", taskData);

    onSubmit(isEditing ? taskData : event);
    // onSubmit(taskData)
  }

  function handleDueOptionChange(option) {
    console.log("handleDueOptionChange - Changing dueOption to:", option);

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
