import { Event } from '../../types';
import { formatDate, getStatusBadge } from '../../utils/helpers';

interface SlotCardProps {
  slot: Event;
  onRequestSwap: (slot: Event) => void;
}

export const SlotCard = ({ slot, onRequestSwap }: SlotCardProps) => {
  return (
    <div className="surface-card p-3 shadow-1 border-round hover:shadow-2 transition-all">
      <div className="flex justify-content-between align-items-start mb-2">
        <h4 className="m-0 text-900">{slot.title}</h4>
        <span className="text-sm text-color-secondary">
          by {slot.owner?.name || 'Unknown User'}
        </span>
      </div>

      <div className="text-sm text-color-secondary mb-3">
        <i className="pi pi-clock mr-2"></i>
        {formatDate(slot.startTime)} - {formatDate(slot.endTime)}
      </div>

      <div className="flex justify-content-between align-items-center">
        <span className="inline-flex align-items-center justify-content-center bg-green-100 text-green-800 px-2 py-1 border-round text-xs font-medium">
          <i className={`${getStatusBadge(slot.status)} mr-1`}></i>
          Available for Swap
        </span>

        <button
          className="p-button p-button-success p-button-sm"
          onClick={() => onRequestSwap(slot)}
        >
          <i className="pi pi-refresh mr-2"></i>
          Request Swap
        </button>
      </div>
    </div>
  );
};