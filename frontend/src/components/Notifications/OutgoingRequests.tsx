import { SwapRequest } from '../../types';
import { formatDate, getStatusBadge } from '../../utils/helpers';
import { SWAP_STATUS_LABELS } from '../../utils/constants';

interface OutgoingRequestsProps {
  requests: SwapRequest[];
  loading?: boolean;
}

export const OutgoingRequests = ({ requests, loading }: OutgoingRequestsProps) => {
  if (loading) {
    return (
      <div className="text-center p-4">
        <i className="pi pi-spin pi-spinner text-2xl"></i>
        <p>Loading requests...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="text-center p-4 surface-100 border-round">
        <i className="pi pi-send text-4xl text-color-secondary mb-3"></i>
        <h4 className="text-color-secondary">No outgoing requests</h4>
        <p className="text-color-secondary">Your swap requests will appear here.</p>
      </div>
    );
  }

  return (
    <div className="grid">
      {requests.map((request) => (
        <div key={request.id} className="col-12">
          <div className="surface-card p-3 shadow-1 border-round">
            <div className="flex justify-content-between align-items-start mb-3">
              <div>
                <h4 className="m-0 mb-1">Your Swap Request</h4>
                <p className="m-0 text-color-secondary">
                  To: {request.responder?.name || 'Unknown User'}
                </p>
              </div>
              <span className={`inline-flex align-items-center justify-content-center ${
                request.status === 'PENDING' ? 'bg-orange-100 text-orange-800' :
                request.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                'bg-red-100 text-red-800'
              } px-2 py-1 border-round text-xs font-medium`}>
                <i className={`${getStatusBadge(request.status)} mr-1`}></i>
                {SWAP_STATUS_LABELS[request.status as keyof typeof SWAP_STATUS_LABELS]}
              </span>
            </div>

            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="p-3 surface-100 border-round">
                  <h5 className="mt-0 mb-2">Your Offer</h5>
                  <p className="m-0 font-medium">{request.mySlot.title}</p>
                  <p className="m-0 text-sm text-color-secondary">
                    {formatDate(request.mySlot.startTime)} - {formatDate(request.mySlot.endTime)}
                  </p>
                </div>
              </div>
              <div className="col-12 md:col-6">
                <div className="p-3 surface-100 border-round">
                  <h5 className="mt-0 mb-2">Requested Slot</h5>
                  <p className="m-0 font-medium">{request.theirSlot.title}</p>
                  <p className="m-0 text-sm text-color-secondary">
                    {formatDate(request.theirSlot.startTime)} - {formatDate(request.theirSlot.endTime)}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-sm text-color-secondary mt-2">
              Requested: {formatDate(request.createdAt)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};