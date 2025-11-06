import { Event } from '../../types';
import { formatDate, getStatusBadge } from '../../utils/helpers';
import { EVENT_STATUS_LABELS } from '../../utils/constants';

interface EventListProps {
  events: Event[];
  onUpdateStatus: (id: string, status: string) => Promise<Event>;
  onDelete: (id: string) => Promise<void>;
  loading?: boolean;
}


export const EventList = ({ events, onUpdateStatus, onDelete, loading }: EventListProps) => {
  const handleStatusChange = async (eventId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'BUSY' ? 'SWAPPABLE' : 'BUSY';
    await onUpdateStatus(eventId, newStatus);
  };

  const handleDelete = async (eventId: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      await onDelete(eventId);
    }
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <i className="pi pi-spin pi-spinner text-2xl"></i>
        <p>Loading events...</p>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center p-4 surface-100 border-round">
        <i className="pi pi-calendar text-4xl text-color-secondary mb-3"></i>
        <h4 className="text-color-secondary">No events found</h4>
        <p className="text-color-secondary">Create your first event to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {events.map((event) => (
        <div key={event.id} className="col-12 lg:col-6 xl:col-4">
          <div className="surface-card p-3 shadow-1 border-round hover:shadow-2 transition-all">
            <div className="flex justify-content-between align-items-start mb-2">
              <h4 className="m-0 text-900">{event.title}</h4>
              <div className="flex gap-1">
                <button
                  className="p-button p-button-text p-button-sm"
                  onClick={() => handleStatusChange(event.id, event.status)}
                  title={event.status === 'BUSY' ? 'Make Swappable' : 'Mark as Busy'}
                >
                  <i className={getStatusBadge(event.status)}></i>
                </button>
                <button
                  className="p-button p-button-text p-button-sm p-button-danger"
                  onClick={() => handleDelete(event.id)}
                  title="Delete Event"
                >
                  <i className="pi pi-trash"></i>
                </button>
              </div>
            </div>

            <div className="text-sm text-color-secondary mb-2">
              <i className="pi pi-clock mr-2"></i>
              {formatDate(event.startTime)} - {formatDate(event.endTime)}
            </div>

            <div className="flex align-items-center">
              <span className={`inline-flex align-items-center justify-content-center ${
                event.status === 'SWAPPABLE' ? 'bg-green-100 text-green-800' :
                event.status === 'SWAP_PENDING' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
              } px-2 py-1 border-round text-xs font-medium`}>
                <i className={`${getStatusBadge(event.status)} mr-1`}></i>
                {EVENT_STATUS_LABELS[event.status as keyof typeof EVENT_STATUS_LABELS]}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};