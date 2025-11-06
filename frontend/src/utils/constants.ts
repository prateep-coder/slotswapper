export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const EVENT_STATUS = {
  BUSY: 'BUSY',
  SWAPPABLE: 'SWAPPABLE',
  SWAP_PENDING: 'SWAP_PENDING'
} as const;

export const SWAP_REQUEST_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
} as const;

export const EVENT_STATUS_LABELS = {
  BUSY: 'Busy',
  SWAPPABLE: 'Swappable',
  SWAP_PENDING: 'Swap Pending'
} as const;

export const SWAP_STATUS_LABELS = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled'
} as const;
