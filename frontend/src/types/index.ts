export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  status: 'BUSY' | 'SWAPPABLE' | 'SWAP_PENDING';
  ownerId: string;
  owner?: { id: string; name: string; email: string };  
  createdAt: string;
  updatedAt: string;
}


export interface SwapRequest {
  id: string;
  mySlotId: string;
  theirSlotId: string;
  requestorId: string;
  responderId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  mySlot: Event;
  theirSlot: Event & {
    owner?: {
      id: string;
      name: string;
      email: string;
    };
  };
  requestor?: {
    id: string;
    name: string;
    email: string;
  };
  responder?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}