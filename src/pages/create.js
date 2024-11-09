import Form from "../components/taskForm/TaskForm";
import Link from "next/link";

export default function CreateTaskPage() {
  async function addTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
  }
  return (
    <>
      <h2 id="add-task">Add Task</h2>
      <Link href="/" passHref legacyBehavior>
        back
      </Link>
      <Form onSubmit={addTask} formName={"add-task"} />
    </>
  );
}
