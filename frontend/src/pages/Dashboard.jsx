import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import API from "../api";
import TaskModal from "../components/TaskModal";
import "../App.css";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("low");
  const [dueDate, setDueDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editTaskId, setEditTaskId] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks/");
      setTasks(res.data.tasks);
    } catch (err) {
      console.error("Error fetching tasks", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/");
      }
    }
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString("en-GB") : "Not set";
  };

  const createOrUpdateTask = async () => {
    if (!title) {
      alert("Task title is required");
      return;
    }

    const taskData = { title, description, status, priority, dueDate };

    try {
      if (editTaskId) {
        await API.put(`/tasks/update/${editTaskId}`, taskData);
      } else {
        await API.post("/tasks/create", taskData);
      }

      setTitle("");
      setDescription("");
      setStatus("pending");
      setPriority("low");
      setDueDate("");
      setShowModal(false);
      setEditTaskId(null);
      fetchTasks();
    } catch (err) {
      console.error("Failed to save task", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await API.delete(`/tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority);
    setDueDate(task.dueDate?.slice(0, 10));
    setEditTaskId(task._id);
    setShowModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <div className="container">
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>

      <h1 className="dashboard-title">
        Task Dashboard <br />
        <button className="add-btn" onClick={() => setShowModal(true)}>
          Add Task
        </button>
      </h1>

      <div className="task-grid">
        {tasks.map((task) => (
          <div key={task._id} className="task-card">
            <h3>{task.title}</h3>
            <p><strong>Description:</strong> {task.description}</p>
            <p><strong>Due:</strong> {formatDate(task.dueDate)}</p>
            <p><strong>Status:</strong> {task.status}</p>
            <p><strong>Priority:</strong> {task.priority}</p>
            <div className="task-actions">
              <button className="edit-btn" onClick={() => handleEdit(task)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => deleteTask(task._id)}>
                Delete
              </button>
              <a
                className="share-btn"
                href={`mailto:?subject=Task: ${encodeURIComponent(task.title)}&body=${encodeURIComponent(
                  `Task Details:\n\nTitle: ${task.title}\nDescription: ${task.description}\nDue: ${formatDate(
                    task.dueDate
                  )}\nStatus: ${task.status}\nPriority: ${task.priority}`
                )}`}
              >
                Share
              </a>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <TaskModal
          onClose={() => {
            setShowModal(false);
            setEditTaskId(null);
          }}
          onSave={createOrUpdateTask}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          dueDate={dueDate}
          setDueDate={setDueDate}
        />
      )}
    </div>
  );
}

export default Dashboard;  
