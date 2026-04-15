import { useEffect, useState } from 'react';
import api from '../api/axios';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      setTasks(
        (response.data.data.tasks || []).map((task) => ({
          ...task,
          canDelete: user?.role === 'ADMIN',
        }))
      );
      setError('');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not load tasks right now.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const closeForm = () => {
    setIsFormOpen(false);
    setSelectedTask(null);
  };

  const handleCreateClick = () => {
    setSelectedTask(null);
    setIsFormOpen(true);
  };

  const handleEdit = (task) => {
    setSelectedTask(task);
    setIsFormOpen(true);
  };

  const handleSubmitTask = async (payload) => {
    try {
      if (selectedTask) {
        await api.put(`/tasks/${selectedTask.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }

      await fetchTasks();
      closeForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save task.');
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      await fetchTasks();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to delete task.');
    }
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-head">
        <div>
          <h1>Hello, {user?.name || user?.email || 'there'}</h1>
          <p>Your task board stays synced and simple.</p>
        </div>
        <button type="button" className="btn btn--primary" onClick={handleCreateClick}>
          + New Task
        </button>
      </section>

      {error ? <p className="form-error dashboard-error">{error}</p> : null}

      <section className="task-grid">
        {tasks.length ? (
          tasks.map((task) => <TaskCard key={task.id} task={task} onEdit={handleEdit} onDelete={handleDelete} />)
        ) : (
          <div className="task-empty">No tasks yet. Create your first task to get started.</div>
        )}
      </section>

      <TaskForm isOpen={isFormOpen} initialTask={selectedTask} onSubmit={handleSubmitTask} onCancel={closeForm} />
    </main>
  );
}
