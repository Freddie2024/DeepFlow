import React, { useEffect } from "react";
import styles from "./TaskForm.module.css";

export default function TaskForm({ onSubmit }) {
  useEffect(() => {
    const textarea = document.getElementById("description");

    function autoResize() {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }

    textarea.addEventListener("input", autoResize);

    return () => textarea.removeEventListener("input", autoResize);
  }, []);

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
          // defaultValue={defaultData?.title}
        />{" "}
        <br />
        <label htmlFor="description">Description: </label> <br />
        <textarea
          id="description"
          name="description"
          rows="2"
          maxLength="500"
          className={styles.formInput}
          // defaultValue={defaultData?.description}
        />
        <section className={styles.radioGroups}>
          <div className={styles.radioGroup}>
            <p>Duration:</p>
            <input type="radio" name="priority" id="long" value="long" />
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
              name="dueDate"
              id="today"
              value="today"
              required
            />
            <label htmlFor="today"> Today</label> <br />
            <input type="radio" name="dueDate" id="tomorrow" value="tomorrow" />
            <label htmlFor="tomorrow"> Tomorrow</label> <br />
            <input type="radio" name="dueDate" id="someday" value="someday" />
            <label htmlFor="someday"> Someday</label> <br />
          </div>
        </section>
        <button className={styles.submitButton} type="submit">
          {/* {defaultData ? "Update task" :  */}
          Add task
          {/* } */}
        </button>
      </form>
    </>
  );
}
