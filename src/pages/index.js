import TaskForm from "../components/taskForm/TaskForm";
import { useTasks } from "../hooks/useTasks";
import TaskList from "../components/taskList/TaskList";

export default function Home() {
  const { tasks, addNewTask, deleteTask, toggleTaskCompletion, editTask } =
    useTasks();

  async function handleAddNewTask(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newTask = Object.fromEntries(formData);
    await addNewTask(newTask);
  }

  if (!tasks || tasks.length === 0) {
    return (
      <>
        <h2>No tasks so far</h2>
        <p>Create your first task!</p>
        <TaskForm onSubmit={handleAddNewTask} />
      </>
    );
  }

  return (
    <TaskList
      title="All Tasks"
      tasks={tasks}
      onDelete={deleteTask}
      onToggle={toggleTaskCompletion}
      // onEdit={editTask}
      showDueDate={true}
    />
  );
}
