import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">
        Task Management System
      </h1>

      <TaskList />
    </div>
  );
}

export default App;