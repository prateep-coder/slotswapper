import { useState } from 'react';
import { useEvents } from '../hooks/useEvents';
import { EventForm } from '../components/Calendar/EventForm';
import { EventList } from '../components/Calendar/EventList';

export const Dashboard = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const { events, loading, error, createEvent, updateEventStatus, deleteEvent } = useEvents();

  const handleCreateEvent = async (eventData: {
    title: string;
    startTime: string;
    endTime: string;
    status?: string;
  }) => {
    await createEvent(eventData);
    setShowEventForm(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="m-0 text-900">My Calendar</h1>
          <p className="m-0 text-color-secondary">Manage your time slots and availability</p>
        </div>
        <button
          className="p-button p-button-primary"
          onClick={() => setShowEventForm(true)}
        >
          <i className="pi pi-plus mr-2"></i>
          Add Event
        </button>
      </div>

      {error && (
        <div className="p-message p-message-error mb-4">
          {error}
        </div>
      )}

      {showEventForm ? (
        <div className="mb-4">
          <EventForm
            onSubmit={handleCreateEvent}
            onCancel={() => setShowEventForm(false)}
          />
        </div>
      ) : (
        <EventList
          events={events}
          onUpdateStatus={updateEventStatus}
          onDelete={deleteEvent}
          loading={loading}
        />
      )}
    </div>
  );
};