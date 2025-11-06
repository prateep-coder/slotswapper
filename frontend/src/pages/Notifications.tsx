import { useState } from 'react';
import { useSwap } from '../hooks/useSwap';
import { IncomingRequests } from '../components/Notifications/IncomingRequests';
import { OutgoingRequests } from '../components/Notifications/OutgoingRequests';

export const Notifications = () => {
  const [activeTab, setActiveTab] = useState<'incoming' | 'outgoing'>('incoming');
  const { 
    incomingRequests, 
    outgoingRequests, 
    loading, 
    error, 
    respondToSwapRequest 
  } = useSwap();

  const handleRespond = async (requestId: string, accept: boolean) => {
    await respondToSwapRequest(requestId, accept);
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="m-0 text-900">Notifications</h1>
        <p className="m-0 text-color-secondary">Manage your swap requests</p>
      </div>

      {error && (
        <div className="p-message p-message-error mb-4">
          {error}
        </div>
      )}

      <div className="mb-4">
        <div className="flex border-bottom-1 surface-border">
          <button
            className={`p-button p-button-text ${
              activeTab === 'incoming' ? 'p-button-primary border-bottom-2 border-primary' : ''
            }`}
            onClick={() => setActiveTab('incoming')}
          >
            <i className="pi pi-inbox mr-2"></i>
            Incoming Requests ({incomingRequests.filter(req => req.status === 'PENDING').length})
          </button>
          <button
            className={`p-button p-button-text ${
              activeTab === 'outgoing' ? 'p-button-primary border-bottom-2 border-primary' : ''
            }`}
            onClick={() => setActiveTab('outgoing')}
          >
            <i className="pi pi-send mr-2"></i>
            Outgoing Requests ({outgoingRequests.length})
          </button>
        </div>
      </div>

      {activeTab === 'incoming' ? (
        <IncomingRequests
          requests={incomingRequests}
          onRespond={handleRespond}
          loading={loading}
        />
      ) : (
        <OutgoingRequests
          requests={outgoingRequests}
          loading={loading}
        />
      )}
    </div>
  );
};