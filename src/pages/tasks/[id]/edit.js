import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTasks } from "@/src/hooks/useTasks";
import TaskForm from "@/src/components/taskForm/TaskForm";

export default function EditTaskPage() {
  const router = useRouter();
  const { id } = router.query;
  const { tasks, editTask } = useTasks();
  const [task, setTask] = useState(null);

  useEffect(() => {
    if (id && tasks) {
      const foundTask = tasks.find((task) => task._id === id);
      if (foundTask) setTask(foundTask);
    }
  }, [id, tasks]);

  async function handleEditTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const updatedData = Object.fromEntries(formData);

    await editTask(id, updatedData);
    router.back();
  }

  if (!task) return <p>Loading task data...</p>;

  return (
    <>
      <h2>Edit Task</h2>
      <TaskForm onSubmit={handleEditTask} defaultData={task} />
    </>
  );
}
