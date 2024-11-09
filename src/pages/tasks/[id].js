import { useRouter } from "next/router";
// import { mockTasks } from "@/src/mockData"; // Change later
import { useTasks } from "@/src/hooks/useTasks";
import TaskDetails from "@/src/components/taskDetails/TaskDetails";

export default function TaskDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { tasks, toggleTaskCompletion, editTask, deleteTask } = useTasks();
  // change later:
  //   const task = mockTasks.find((task) => task._id === id);
  const task = tasks?.find((task) => task._id === id);

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
