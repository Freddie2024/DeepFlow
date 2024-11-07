import Image from "next/image";
import styles from "./index.module.css";
import Link from "next/link";
import Form from "../components/form/Form";

export default function Home() {
  return (
    <>
      <h1>Today</h1>
      <div>
        <h2>No tasks so far.</h2>
        <p>
          Create 6 tasks you want to focus on today: 1 major, 2 medium, 3 small
          ones with a total of 6 hours.
        </p>

        <Form />
      </div>
    </>
  );
}
