import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTasks } from "@/src/hooks/useTasks";
import TaskDetails from "@/src/components/taskDetails/TaskDetails";

export default function TaskDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { tasks, toggleTaskCompletion, editTask, deleteTask } = useTasks();

  const [task, setTask] = useState(null);

  useEffect(() => {
    if (router.isReady && tasks && id) {
      const foundTask = tasks.find((task) => task._id === id);
      setTask(foundTask);
    }
  }, [tasks, id, router.isReady]);

  if (!task) return <p>Loading task details...</p>;

  const handleDelete = (taskId) => {
    deleteTask(taskId);
    router.back();
  };

  return (
    <>
      <TaskDetails
        task={task}
        onToggle={toggleTaskCompletion}
        onEdit={editTask}
        onDelete={handleDelete}
      />
    </>
  );
}
