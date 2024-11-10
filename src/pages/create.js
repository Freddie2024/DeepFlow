import Form from "../components/taskForm/TaskForm";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTasks } from "../hooks/useTasks";
// import { useSession }

export default function CreateTaskPage() {
  const router = useRouter();
  const { addNewTask } = useTasks();
  // const { data: session } = useSession();

  async function handleAddNewTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    // data.user = session?.user?.email || "defaultUser@example.com";
    data.user = "user1";

    await addNewTask(data);
    router.push("/");
  }

  return (
    <>
      <h2 id="add-task">Add Task</h2>
      <Link href="/" passHref legacyBehavior>
        back
      </Link>
      <Form onSubmit={handleAddNewTask} formName={"add-task"} />
    </>
  );
}
