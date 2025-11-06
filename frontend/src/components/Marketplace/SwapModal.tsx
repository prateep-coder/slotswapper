import { useState } from 'react';
import { Event } from '../../types';
import { formatDate } from '../../utils/helpers';

interface SwapModalProps {
  targetSlot: Event;
  mySlots: Event[];
  onSubmit: (mySlotId: string, theirSlotId: string) => Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export const SwapModal = ({ targetSlot, mySlots, onSubmit, onCancel, loading }: SwapModalProps) => {
  const [selectedSlotId, setSelectedSlotId] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotId) {
      alert('Please select a slot to offer');
      return;
    }
    await onSubmit(selectedSlotId, targetSlot.id);
  };

  const availableSlots = mySlots.filter(slot => slot.status === 'SWAPPABLE');

  return (
    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
      <h3 className="mt-0 mb-4">Request Swap</h3>

      <div className="mb-4 p-3 surface-100 border-round">
        <h4 className="mt-0 mb-2">Target Slot</h4>
        <p className="m-0 font-medium">{targetSlot.title}</p>
        <p className="m-0 text-sm text-color-secondary">
          {formatDate(targetSlot.startTime)} - {formatDate(targetSlot.endTime)}
        </p>
        <p className="m-0 text-sm text-color-secondary">
          Owner: {targetSlot.owner?.name || 'Unknown User'}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="field mb-4">
          <label htmlFor="mySlot" className="block font-medium mb-2">
            Select your slot to offer:
          </label>
          <select
            id="mySlot"
            value={selectedSlotId}
            onChange={(e) => setSelectedSlotId(e.target.value)}
            className="w-full p-inputtext"
            required
          >
            <option value="">Choose a slot...</option>
            {availableSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.title} - {formatDate(slot.startTime)}
              </option>
            ))}
          </select>
        </div>

        {availableSlots.length === 0 && (
          <div className="p-message p-message-warn mb-3">
            <i className="pi pi-exclamation-triangle mr-2"></i>
            You don't have any swappable slots. Mark some of your busy slots as "Swappable" first.
          </div>
        )}

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
            disabled={loading || availableSlots.length === 0}
          >
            {loading ? (
              <>
                <i className="pi pi-spin pi-spinner mr-2"></i>
                Requesting...
              </>
            ) : (
              'Request Swap'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};