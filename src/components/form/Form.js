import React, { useEffect } from "react";
import styles from "./Form.module.css";

export default function Form({ onSubmit }) {
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
            <input type="radio" name="duration" id="3hours" value="3hours" />
            <label htmlFor="3hours"> 3 hours</label> <br />
            <input type="radio" name="duration" id="1hour" value="1hour" />
            <label htmlFor="1hour"> 1 hour</label> <br />
            <input type="radio" name="duration" id="20min" value="20min" />
            <label htmlFor="20min"> 20 minutes</label>
          </div>
          <div className={styles.radioGroup}>
            <p>Due:</p>
            <input type="radio" name="day" id="today" value="today" required />
            <label htmlFor="today"> Today</label> <br />
            <input type="radio" name="day" id="tomorrow" value="tomorrow" />
            <label htmlFor="tomorrow"> Tomorrow</label> <br />
            <input type="radio" name="day" id="someday" value="someday" />
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
