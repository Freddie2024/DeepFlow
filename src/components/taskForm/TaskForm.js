"use client";

import React, { useEffect, useState } from "react";
import styles from "./TaskForm.module.css";
import Button from "../button/Button";
import { showWarning } from "../../lib/sweetAlertUtils";
import {
  getLocalISOString,
  determineDueOption,
  getTodayDate,
  getTomorrowDate,
} from "../../utils/dateUtils";
import {
  validateDailyTaskLimit,
  validatePriorityLimit,
  filterCurrentTask,
} from "../../utils/taskValidation";

/**
 * TaskForm Component
 * Handles creation and editing of tasks with validation for daily limits
 * and priority-based time management
 *
 * @component
 * @param {Object} props
 * @param {Function} props.onSubmit - Handler for form submission
 * @param {Object} props.defaultData - Default values for editing mode
 * @param {boolean} props.isEditing - Whether form is in edit mode
 * @param {Function} props.onCancel - Handler for cancellation
 * @param {Array} props.tasksForToday - List of tasks scheduled for today
 * @param {Array} props.tasksForTomorrow - List of tasks scheduled for tomorrow
 * @param {string|null} props.currentTaskId - ID of task being edited
 */

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
  // --- State Management ---
  const [dueOption, setDueOption] = useState(
    isEditing
      ? determineDueOption(getLocalISOString(new Date(defaultData.dueDate)))
      : "today"
  );
  const [priority, setPriority] = useState(defaultData.priority || "");
  const [confirmNoDate, setConfirmNoDate] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Reset someday confirmation when component mounts
  useEffect(() => {
    setConfirmNoDate(false);
  }, []);

  // Auto-resize textarea for description
  useEffect(() => {
    const textarea = document.getElementById("description");

    function autoResize() {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    textarea.addEventListener("input", autoResize);

    return () => textarea.removeEventListener("input", autoResize);
  }, []);

  // --- Event Handlers ---
  /**
   * Tracks changes in form inputs
   */
  const handleInputChange = () => {
    setHasChanges(true);
  };

  /**
   * Handles form cancellation with unsaved changes warning
   */
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm("Are you sure you want to discard your changes?")) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  /**
   * Handles form submission with validation
   * @param {Event} event - Form submission event
   */
  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const taskData = Object.fromEntries(formData);
    const selectedPriority = taskData.priority;

    // Validate tasks for today
    if (dueOption === "today") {
      const otherTodayTasks = filterCurrentTask(tasksForToday, currentTaskId);

      // Check daily task limit
      if (!(await validateDailyTaskLimit(otherTodayTasks, "today"))) {
        return;
      }

      // Check priority-specific limits
      if (!(await validatePriorityLimit(selectedPriority, otherTodayTasks))) {
        return;
      }
    }

    // Validate tasks for tomorrow
    if (dueOption === "tomorrow") {
      const otherTomorrowTasks = filterCurrentTask(
        tasksForTomorrow,
        currentTaskId
      );

      // Check daily task limit
      if (!(await validateDailyTaskLimit(otherTomorrowTasks, "tomorrow"))) {
        return;
      }

      // Check priority-specific limits
      if (
        !(await validatePriorityLimit(selectedPriority, otherTomorrowTasks))
      ) {
        return;
      }
    }

    // Set due date based on selected option
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
      await showWarning(
        "Please confirm that you want to add this task without a due date."
      );
      return;
    }

    taskData.dueDate = dueDate;

    // Handle form submission based on mode
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

  /**
   * Handles changes in due date option
   * @param {string} option - Selected due date option
   */
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
              required
            />
            <label htmlFor="long">3 hours</label>
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
            />
            <label htmlFor="medium">1 hour</label>
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
            />
            <label htmlFor="short">20 minutes</label>
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
          <Button type="submit" variant="primary">
            {isEditing ? "Save" : "Add Task"}
          </Button>
          <Button type="button" variant="delete" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </>
  );
}
