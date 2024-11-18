"use client";

import React, { useEffect, useState } from "react";
import styles from "./TaskForm.module.css";
import Button from "../button/Button";
import { showWarning } from "../../lib/sweetAlertUtils";

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
  // disabledPriorities = [],
  isEditing = false,
  onCancel,
  tasksForToday = [],
  tasksForTomorrow = [],
  currentTaskId = null,
}) {
  const [dueOption, setDueOption] = useState(
    isEditing
      ? determineDueOption(getLocalISOString(new Date(defaultData.dueDate)))
      : "today"
  );
  const [priority, setPriority] = useState(defaultData.priority || "");
  const [confirmNoDate, setConfirmNoDate] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  const handleInputChange = () => {
    setHasChanges(true);
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("Are you sure you want to discard your changes?")) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData);
    const selectedPriority = taskData.priority;

    if (dueOption === "today") {
      const otherTodayTasks = tasksForToday.filter(
        (task) => task._id !== currentTaskId
      );

      if (otherTodayTasks.length >= 6) {
        // if (
        //   !confirm(
        //     "You already have 6 tasks scheduled for today.\nPlease check the tasks duration to ensure a balanced workload: \n\n" +
        //       "• Maximum 1 long task (3 hours)\n" +
        //       "• Maximum 2 medium tasks (1 hour each)\n" +
        //       "• Maximum 3 short tasks (20 minutes each)"
        //   )
        // ) {
        //   return;
        // }
        const confirmed = await showWarning(
          "Task Limit Warning",
          "You already have 6 tasks scheduled for today.\n\n" +
            "Please check the tasks duration to ensure a balanced workload:\n" +
            "• Maximum 1 long task (3 hours)\n" +
            "• Maximum 2 medium tasks (1 hour each)\n" +
            "• Maximum 3 short tasks (20 minutes each)"
        );
        if (!confirmed) return;
      }

      const longTasksToday = otherTodayTasks.filter(
        (task) => task.priority === "long"
      ).length;
      const mediumTasksToday = otherTodayTasks.filter(
        (task) => task.priority === "medium"
      ).length;
      const shortTasksToday = otherTodayTasks.filter(
        (task) => task.priority === "short"
      ).length;

      if (selectedPriority === "long" && longTasksToday >= 1) {
        // if (
        //   !confirm(
        //     "You should only have 1 long task (3 hours) per day. Continue anyway?"
        //   )
        // ) {
        //   return;
        // }
        const confirmed = await showWarning(
          "Long Task Warning",
          "You should only have 1 long task (3 hours) per day. Continue anyway?"
        );
        if (!confirmed) return;
      }
      if (selectedPriority === "medium" && mediumTasksToday >= 2) {
        //
        const confirmed = await showWarning(
          "Medium Task Warning",
          "You should only have 2 medium tasks (1 hour each) per day. Continue anyway?"
        );
        if (!confirmed) return;
      }
      if (selectedPriority === "short" && shortTasksToday >= 3) {
        // if (
        //   !confirm(
        //     "You should only have 3 short tasks (20 minutes) per day. Continue anyway?"
        //   )
        // ) {
        //   return;
        // }
        const confirmed = await showWarning(
          "Short Task Warning",
          "You should only have 3 short tasks (20 minutes each) per day. Continue anyway?"
        );
        if (!confirmed) return;
      }

      if (dueOption === "tomorrow") {
        // const tomorrowCount = tasksForTomorrow.filter(
        //   (task) => task._id !== currentTaskId
        // ).length;
        // if (tomorrowCount >= 6) {
        //   alert(
        //     "You already have 6 tasks scheduled for tomorrow. Please choose another day."
        //   );
        //   return;
        // }

        const otherTomorrowTasks = tasksForTomorrow.filter(
          (task) => task._id !== currentTaskId
        );

        if (otherTomorrowTasks.length >= 6) {
          // if (
          //   !confirm(
          //     "You already have 6 tasks scheduled for tomorrow.\nPlease check the tasks duration to ensure a balanced workload: \n\n" +
          //       "• Maximum 1 long task (3 hours)\n" +
          //       "• Maximum 2 medium tasks (1 hour each)\n" +
          //       "• Maximum 3 short tasks (20 minutes each)"
          //   )
          // ) {
          //   return;
          // }
          const confirmed = await showWarning(
            "Task Limit Warning",
            "You already have 6 tasks scheduled for tomorrow.\n\n" +
              "Please check the tasks duration to ensure a balanced workload:\n" +
              "• Maximum 1 long task (3 hours)\n" +
              "• Maximum 2 medium tasks (1 hour each)\n" +
              "• Maximum 3 short tasks (20 minutes each)"
          );
          if (!confirmed) return;
        }

        // const tomorrowTasks = tasksForTomorrow.filter(
        //   (task) => task._id !== currentTaskId
        // );
        const longTasksTomorrow = otherTomorrowTasks.filter(
          (task) => task.priority === "long"
        ).length;
        const mediumTasksTomorrow = otherTomorrowTasks.filter(
          (task) => task.priority === "medium"
        ).length;
        const shortTasksTomorrow = otherTomorrowTasks.filter(
          (task) => task.priority === "short"
        ).length;

        if (selectedPriority === "long" && longTasksTomorrow >= 1) {
          // if (
          //   !confirm(
          //     "You should only have 1 long task (3 hours) per day. Continue anyway?"
          //   )
          // ) {
          //   return;
          // }
          const confirmed = await showWarning(
            "Long Task Warning",
            "You should only have 1 long task (3 hours) per day. Continue anyway?"
          );
          if (!confirmed) return;
        }
        if (selectedPriority === "medium" && mediumTasksTomorrow >= 2) {
          // if (
          //   !confirm(
          //     "You should only have 2 medium tasks (1 hour) per day. Continue anyway?"
          //   )
          // ) {
          //   return;
          // }
          const confirmed = await showWarning(
            "Medium Task Warning",
            "You should only have 2 medium tasks (1 hour each) per day. Continue anyway?"
          );
          if (!confirmed) return;
        }
        // if (selectedPriority === "short" && shortTasksTomorrow >= 3) {
        //   if (
        //     !confirm(
        //       "You should only have 3 short tasks (20 minutes) per day. Continue anyway?"
        //     )
        //   ) {
        //     return;
        //   }
        const confirmed = await showWarning(
          "Short Task Warning",
          "You should only have 3 short tasks (20 minutes each) per day. Continue anyway?"
        );
        if (!confirmed) return;
      }
    }

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

  // const todayCount = tasksForToday.filter(
  //   (task) => task._id !== currentTaskId
  // ).length;
  // const tomorrowCount = tasksForTomorrow.filter(
  //   (task) => task._id !== currentTaskId
  // ).length;
  // const isTodayFull = todayCount >= 6;
  // const isTomorrowFull = tomorrowCount >= 6;

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
          onChange={handleInputChange}
        />
        <br />
        <label htmlFor="description">Description: </label> <br />
        <textarea
          id="description"
          name="description"
          rows="2"
          maxLength="1000"
          className={styles.formInput}
          defaultValue={defaultData?.description}
          onChange={handleInputChange}
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
              onChange={() => {
                setPriority("long");
                handleInputChange();
              }}
              // disabled={disabledPriorities.includes("long")}
              required
            />
            <label
              htmlFor="long"
              // className={
              //   disabledPriorities.includes("long") ? styles.disabled : " "
              // }
            >
              3 hours
            </label>
            <br />
            <input
              type="radio"
              name="priority"
              id="medium"
              value="medium"
              checked={priority === "medium"}
              onChange={() => {
                setPriority("medium");
                handleInputChange();
              }}
              // disabled={disabledPriorities.includes("medium")}
            />
            <label
              htmlFor="medium"
              // className={
              //   disabledPriorities.includes("medium") ? styles.disabled : " "
              // }
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
              onChange={() => {
                setPriority("short");
                handleInputChange();
              }}
              // disabled={disabledPriorities.includes("short")}
            />
            <label
              htmlFor="short"
              // className={
              //   disabledPriorities.includes("short") ? styles.disabled : " "
              // }
            >
              20 minutes
            </label>
          </div>
          <div className={styles.radioGroup}>
            <p>Due:</p>
            <input
              type="radio"
              name="dueOption"
              id="today"
              value="today"
              onChange={() => {
                handleDueOptionChange("today");
                handleInputChange();
              }}
              checked={dueOption === "today"}
              // disabled={isTodayFull}
              required
            />
            <label htmlFor="today"> Today</label> <br />
            <input
              type="radio"
              name="dueOption"
              id="tomorrow"
              value="tomorrow"
              onChange={() => {
                handleDueOptionChange("tomorrow");
                handleInputChange();
              }}
              checked={dueOption === "tomorrow"}
              // disabled={isTomorrowFull}
            />
            <label htmlFor="tomorrow"> Tomorrow</label> <br />
            <input
              type="radio"
              name="dueOption"
              id="later"
              value="later"
              onChange={() => {
                handleDueOptionChange("later");
                handleInputChange();
              }}
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
              onChange={() => {
                handleDueOptionChange("someday");
                handleInputChange();
              }}
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
              Save task without a specific date?
            </label>
          </div>
        )}
        <div className={styles.buttonContainer}>
          <button
            className={styles.submitButton}
            type="submit"
            // disabled={dueOption === "someday" && !confirmNoDate}
          >
            {isEditing ? "Save" : "Add Task"}
          </button>
          <Button type="button" variant="delete" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
