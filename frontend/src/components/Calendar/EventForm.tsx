import { useState } from 'react';
import { Event } from '../../types';

interface EventFormProps {
  onSubmit: (eventData: {
    title: string;
    startTime: string;
    endTime: string;
    status?: string;
  }) => Promise<void>;
  onCancel: () => void;
  initialData?: Event;
}

export const EventForm = ({ onSubmit, onCancel, initialData }: EventFormProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [startTime, setStartTime] = useState(
    initialData?.startTime ? new Date(initialData.startTime).toISOString().slice(0, 16) : ''
  );
  const [endTime, setEndTime] = useState(
    initialData?.endTime ? new Date(initialData.endTime).toISOString().slice(0, 16) : ''
  );
  const [status, setStatus] = useState(initialData?.status || 'BUSY');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      alert('End time must be after start time');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        title,
        startTime: new Date(startTime).toISOString(),
        endTime: new Date(endTime).toISOString(),
        status
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="surface-card p-4 shadow-2 border-round">
      <h3 className="mt-0 mb-4">
        {initialData ? 'Edit Event' : 'Create New Event'}
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="field mb-3">
          <label htmlFor="title" className="block font-medium mb-2">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-inputtext"
            placeholder="Enter event title"
            required
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="startTime" className="block font-medium mb-2">
            Start Time
          </label>
          <input
            id="startTime"
            type="datetime-local"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-inputtext"
            required
          />
        </div>

        <div className="field mb-3">
          <label htmlFor="endTime" className="block font-medium mb-2">
            End Time
          </label>
          <input
            id="endTime"
            type="datetime-local"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-inputtext"
            required
          />
        </div>

        <div className="field mb-4">
          <label htmlFor="status" className="block font-medium mb-2">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING')}
            className="w-full p-inputtext"
          >
            <option value="BUSY">Busy</option>
            <option value="SWAPPABLE">Swappable</option>
          </select>
        </div>

        <div className="flex gap-2 justify-content-end">
          <button
            type="button"
            className="p-button p-button-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="p-button p-button-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="pi pi-spin pi-spinner mr-2"></i>
                Saving...
              </>
            ) : (
              initialData ? 'Update Event' : 'Create Event'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};