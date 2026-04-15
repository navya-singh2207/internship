const STATUS_LABELS = {
  TODO: 'To Do',
  IN_PROGRESS: 'In Progress',
  DONE: 'Done',
};

export default function TaskCard({ task, onEdit, onDelete }) {
  const canDelete = task.canDelete;

  return (
    <article className="task-card">
      <div className="task-card__top">
        <h3>{task.title}</h3>
        <span className={`status-badge status-badge--${task.status}`}>{STATUS_LABELS[task.status] || task.status}</span>
      </div>
      <p>{task.description || 'No description added yet.'}</p>
      <div className="task-card__actions">
        <button type="button" className="btn btn--ghost" onClick={() => onEdit(task)}>
          Edit
        </button>
        {canDelete ? (
          <button type="button" className="btn btn--danger" onClick={() => onDelete(task.id)}>
            Delete
          </button>
        ) : null}
      </div>
    </article>
  );
}
