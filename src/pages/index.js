import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <h1>Tasks for today</h1>
      <div>
        <h2>No tasks for today.</h2>
        <p>
          Create 6 tasks you want to focus on today: 1 major, 2 medium, 3 small
          ones with a total of 6 hours. Think of your task list as something
          like this:
        </p>
        <ul>
          <li>1. Task</li>
          <li>2. Task</li>
          <li>2. Task</li>
          <li>3. Task</li>
          <li>3. Task</li>
          <li>3. Task</li>
        </ul>
        <h2>Create your first task!</h2>
      </div>
    </>
  );
}
