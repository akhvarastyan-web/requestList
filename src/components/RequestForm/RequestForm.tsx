import { useState, useEffect } from 'react';
import './RequestForm.css';
import { RequestItem } from '../../type/requestItem';

interface RequestFormProps {
  onSave: (request: RequestItem) => void;
  currentRequest: RequestItem | null;
  onDelete: (id: number) => void;
  role: 'user' | 'manager';
  onStatusChange: (id: number, status: 'new' | 'in progress' | 'done') => void;
}

export const RequestForm: React.FC<RequestFormProps> = ({
  onSave,
  currentRequest,
  role,
  onStatusChange,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const isManager = role === 'manager';

  const handleStatusUpdate = (newStatus: 'new' | 'in progress' | 'done') => {
    if (currentRequest) {
      onStatusChange(currentRequest.id, newStatus);
    }
  };

  useEffect(() => {
    setErrors({});
    setError('');
    if (currentRequest) {
      setTitle(currentRequest.title);
      setDescription(currentRequest.description);
    } else {
      setTitle('');
      setDescription('');
    }
  }, [currentRequest]);

  const handleInputChange = (
    setter: React.Dispatch<React.SetStateAction<string>>,
    value: string,
  ) => {
    if (currentRequest && currentRequest.status !== 'new') {
      setError('You cannot edit an request that is in progress or completed.');

      return;
    }

    setErrors({});
    setError('');
    setter(value);
  };

  const validate = (): boolean => {
    const tempErrors: { title?: string; description?: string } = {};

    if (!title || title.trim().length < 5) {
      tempErrors.title = 'Title must be at least 5 characters';
    }

    if (!description || description.trim().length < 15) {
      tempErrors.description = 'Description must be at least 15 characters';
    }

    setErrors(tempErrors);

    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    onSave({
      id: currentRequest ? currentRequest.id : undefined,
      title,
      description,
      status: currentRequest ? currentRequest.status : 'new',
    });
    if (!currentRequest) {
      setTitle('');
      setDescription('');
    }
  };

  const handleDeleteClick = () => {
    if (!currentRequest) {
      return;
    }

    if (currentRequest.status !== 'new') {
      setError(
        'You cannot delete an request that is in progress or completed.',
      );

      return;
    }

    setError('');
    onDelete(currentRequest.id);
  };

  return (
    <form onSubmit={handleSubmit} className="request-form">
      {isManager && currentRequest && (
        <div className="id-display">
          <strong>ID: </strong>

          <span>{currentRequest.id}</span>
        </div>
      )}
      <div>
        <label htmlFor="title">Title:</label>
        <input
          id="title"
          type="text"
          placeholder="Brief title for your request"
          value={title}
          onChange={e => handleInputChange(setTitle, e.target.value)}
          required
          disabled={isManager}
        />
        {errors.title && <p className="error-message">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          placeholder="Explain the issue or requirement (minimum 15 characters)"
          onChange={e => handleInputChange(setDescription, e.target.value)}
          required
          disabled={isManager}
        />
        {errors.description && (
          <p className="error-message">{errors.description}</p>
        )}
      </div>

      {isManager && currentRequest && (
        <div className="status-control">
          <label htmlFor="status-select">Status:</label>
          <select
            value={currentRequest.status}
            onChange={e => {
              const value = e.target.value as 'new' | 'in progress' | 'done';

              handleStatusUpdate(value);
            }}
          >
            <option value="new">New</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </div>
      )}

      {error && <p className="error-message">{error}</p>}

      <button type="submit">
        {currentRequest ? 'Update Request' : 'Create Request'}
      </button>
      {currentRequest && (
        <button
          type="button"
          onClick={() => handleDeleteClick()}
          className="delete-btn"
        >
          Delete Request
        </button>
      )}
    </form>
  );
};
