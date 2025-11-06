import { useState, useEffect } from 'react';
import { Event, SwapRequest } from '../types';
import { swapService } from '../services/swap.service';

export const useSwap = () => {
  const [swappableSlots, setSwappableSlots] = useState<Event[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<SwapRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<SwapRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSwappableSlots = async () => {
    setLoading(true);
    setError(null);
    try {
      const { slots } = await swapService.getSwappableSlots();
      setSwappableSlots(slots);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch swappable slots');
    } finally {
      setLoading(false);
    }
  };

  const fetchIncomingRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const { requests } = await swapService.getIncomingRequests();
      setIncomingRequests(requests);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch incoming requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchOutgoingRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const { requests } = await swapService.getOutgoingRequests();
      setOutgoingRequests(requests);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch outgoing requests');
    } finally {
      setLoading(false);
    }
  };

  const createSwapRequest = async (mySlotId: string, theirSlotId: string) => {
    setError(null);
    try {
      const { swapRequest } = await swapService.createSwapRequest(mySlotId, theirSlotId);
      await fetchSwappableSlots(); // Refresh the list
      await fetchOutgoingRequests(); // Refresh outgoing requests
      return swapRequest;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create swap request');
      throw err;
    }
  };

  const respondToSwapRequest = async (requestId: string, accept: boolean) => {
    setError(null);
    try {
      const result = await swapService.respondToSwapRequest(requestId, accept);
      await fetchIncomingRequests(); // Refresh incoming requests
      await fetchOutgoingRequests(); // Refresh outgoing requests
      return result;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to respond to swap request');
      throw err;
    }
  };

  useEffect(() => {
    fetchSwappableSlots();
    fetchIncomingRequests();
    fetchOutgoingRequests();
  }, []);

  return {
    swappableSlots,
    incomingRequests,
    outgoingRequests,
    loading,
    error,
    fetchSwappableSlots,
    fetchIncomingRequests,
    fetchOutgoingRequests,
    createSwapRequest,
    respondToSwapRequest
  };
};