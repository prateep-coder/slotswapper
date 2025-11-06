import { SwapRequest } from '../../types';
import { formatDate, getStatusBadge } from '../../utils/helpers';
import { SWAP_STATUS_LABELS } from '../../utils/constants';

interface IncomingRequestsProps {
  requests: SwapRequest[];
  onRespond: (requestId: string, accept: boolean) => Promise<void>;
  loading?: boolean;
}

export const IncomingRequests = ({ requests, onRespond, loading }: IncomingRequestsProps) => {
  const pendingRequests = requests.filter(req => req.status === 'PENDING');

  if (loading) {
    return (
      <div className="text-center p-4">
        <i className="pi pi-spin pi-spinner text-2xl"></i>
        <p>Loading requests...</p>
      </div>
    );
  }

  if (pendingRequests.length === 0) {
    return (
      <div className="text-center p-4 surface-100 border-round">
        <i className="pi pi-inbox text-4xl text-color-secondary mb-3"></i>
        <h4 className="text-color-secondary">No incoming requests</h4>
        <p className="text-color-secondary">You'll see swap requests from other users here.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {pendingRequests.map((request) => (
        <div key={request.id} className="col-12">
          <div className="surface-card p-3 shadow-1 border-round">
            <div className="flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="m-0 mb-1">Swap Request</h4>
                <p className="m-0 text-color-secondary">
                  From: {request.requestor?.name || 'Unknown User'}
                </p>
              </div>
              <span className="inline-flex align-items-center justify-content-center bg-orange-100 text-orange-800 px-2 py-1 border-round text-xs font-medium">
                <i className={`${getStatusBadge(request.status)} mr-1`}></i>
                {SWAP_STATUS_LABELS[request.status as keyof typeof SWAP_STATUS_LABELS]}
              </span>
            </div>

            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="p-3 surface-100 border-round">
                  <h5 className="mt-0 mb-2">Their Offer</h5>
                  <p className="m-0 font-medium">{request.mySlot.title}</p>
                  <p className="m-0 text-sm text-color-secondary">
                    {formatDate(request.mySlot.startTime)} - {formatDate(request.mySlot.endTime)}
                  </p>
                </div>
              </div>
              <div className="col-12 md:col-6">
                <div className="p-3 surface-100 border-round">
                  <h5 className="mt-0 mb-2">Your Slot</h5>
                  <p className="m-0 font-medium">{request.theirSlot.title}</p>
                  <p className="m-0 text-sm text-color-secondary">
                    {formatDate(request.theirSlot.startTime)} - {formatDate(request.theirSlot.endTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2 justify-content-end mt-3">
              <button
                className="p-button p-button-danger"
                onClick={() => onRespond(request.id, false)}
                disabled={loading}
              >
                <i className="pi pi-times mr-2"></i>
                Reject
              </button>
              <button
                className="p-button p-button-success"
                onClick={() => onRespond(request.id, true)}
                disabled={loading}
              >
                <i className="pi pi-check mr-2"></i>
                Accept
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};