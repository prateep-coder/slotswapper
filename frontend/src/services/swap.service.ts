import { api } from './api';
import { Event, SwapRequest } from '../types';

export const swapService = {
  async getSwappableSlots(): Promise<{ slots: Event[] }> {
    const response = await api.get<{ slots: Event[] }>('/swap/swappable-slots');
    return response.data;
  },

  async createSwapRequest(mySlotId: string, theirSlotId: string): Promise<{ swapRequest: SwapRequest }> {
    const response = await api.post<{ swapRequest: SwapRequest }>('/swap/swap-request', {
      mySlotId,
      theirSlotId
    });
    return response.data;
  },

  async respondToSwapRequest(requestId: string, accept: boolean): Promise<{ 
    message: string; 
    swapRequest: SwapRequest 
  }> {
    const response = await api.post<{ 
      message: string; 
      swapRequest: SwapRequest 
    }>(`/swap/swap-response/${requestId}`, { accept });
    return response.data;
  },

  async getIncomingRequests(): Promise<{ requests: SwapRequest[] }> {
    const response = await api.get<{ requests: SwapRequest[] }>('/swap/requests/incoming');
    return response.data;
  },

  async getOutgoingRequests(): Promise<{ requests: SwapRequest[] }> {
    const response = await api.get<{ requests: SwapRequest[] }>('/swap/requests/outgoing');
    return response.data;
  }
};