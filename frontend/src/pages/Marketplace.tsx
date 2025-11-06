import { useState } from 'react';
import { useSwap } from '../hooks/useSwap';
import { useEvents } from '../hooks/useEvents';
import { SlotCard } from '../components/Marketplace/SlotCard';
import { SwapModal } from '../components/Marketplace/SwapModal';
import { Event } from '../types';

export const Marketplace = () => {
  const [selectedSlot, setSelectedSlot] = useState<Event | null>(null);
  const { swappableSlots, loading, error, createSwapRequest } = useSwap();
  const { events } = useEvents();

  const handleRequestSwap = (slot: Event) => {
    setSelectedSlot(slot);
  };

  const handleSubmitSwap = async (mySlotId: string, theirSlotId: string) => {
    await createSwapRequest(mySlotId, theirSlotId);
    setSelectedSlot(null);
  };

  const mySwappableSlots = events.filter(event => event.status === 'SWAPPABLE');

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="m-0 text-900">Marketplace</h1>
        <p className="m-0 text-color-secondary">
          Discover available time slots from other users
        </p>
      </div>

      {error && (
        <div className="p-message p-message-error mb-4">
          {error}
        </div>
      )}

      {selectedSlot && (
        <div className="fixed top-0 left-0 w-full h-full bg-black-alpha-40 flex align-items-center justify-content-center z-5 p-3">
          <SwapModal
            targetSlot={selectedSlot}
            mySlots={mySwappableSlots}
            onSubmit={handleSubmitSwap}
            onCancel={() => setSelectedSlot(null)}
          />
        </div>
      )}

      {loading ? (
        <div className="text-center p-4">
          <i className="pi pi-spin pi-spinner text-2xl"></i>
          <p>Loading available slots...</p>
        </div>
      ) : swappableSlots.length === 0 ? (
        <div className="text-center p-4 surface-100 border-round">
          <i className="pi pi-shopping-cart text-4xl text-color-secondary mb-3"></i>
          <h4 className="text-color-secondary">No slots available</h4>
          <p className="text-color-secondary">
            Check back later for new swappable time slots.
          </p>
        </div>
      ) : (
        <div className="grid">
          {swappableSlots.map((slot) => (
            <div key={slot.id} className="col-12 lg:col-6 xl:col-4">
              <SlotCard
                slot={slot}
                onRequestSwap={handleRequestSwap}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};