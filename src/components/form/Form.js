import React from "react";
import styles from "./Form.module.css";
// import { form } from "./Form.module.css";

export default function Form({ onSubmit }) {
  return (
    <>
      <form className={styles.form} aria-label="Task Form" onSubmit={onSubmit}>
        <label htmlFor="title">Title: </label> <br />
        <input
          id="title"
          name="title"
          type="text"
          required
          // defaultValue={defaultData?.title}
        />{" "}
        <br />
        <label htmlFor="description">Description: </label> <br />
        <textarea
          id="description"
          name="description"
          cols="40"
          rows="5"
          // defaultValue={defaultData?.description}
        />
        {/* <div className={styles.radioGroups}> */}
        {/* <div className={styles.radioGroup}> */}
        {/* Inline-Style für Flexbox weil Import aus Form.module.css nicht funktioniert */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <p>Duration:</p>
            <input type="radio" name="duration" id="3hours" value="3hours" />
            <label htmlFor="3hours"> 3 hours</label> <br />
            <input type="radio" name="duration" id="1hour" value="1hour" />
            <label htmlFor="1hour"> 1 hour</label> <br />
            <input type="radio" name="duration" id="20min" value="20min" />
            <label htmlFor="20min"> 20 minutes</label>
          </div>
          {/* <div className={styles.radioGroup}> */}
          <div style={{ flex: 1 }}>
            <p>Due:</p>
            <input type="radio" name="day" id="today" value="today" required />
            <label htmlFor="today"> Today</label> <br />
            <input type="radio" name="day" id="tomorrow" value="tomorrow" />
            <label htmlFor="tomorrow"> Tomorrow</label> <br />
            <input type="radio" name="day" id="someday" value="someday" />
            <label htmlFor="someday"> Someday</label> <br />
          </div>
        </div>
        <button type="submit">
          {/* {defaultData ? "Update task" :  */}
          "Add task"
          {/* } */}
        </button>
      </form>
    </>
  );
}
