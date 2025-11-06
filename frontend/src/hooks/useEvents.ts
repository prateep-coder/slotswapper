import { useState, useEffect } from 'react';
import { Event } from '../types';
import { eventsService } from '../services/events.service';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = async (status?: string) => {
    setLoading(true);
    setError(null);
    try {
      const { events } = await eventsService.getEvents(status);
      setEvents(events);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: {
    title: string;
    startTime: string;
    endTime: string;
    status?: string;
  }) => {
    setError(null);
    try {
      const { event } = await eventsService.createEvent(eventData);
      setEvents(prev => [...prev, event]);
      return event;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create event');
      throw err;
    }
  };

  const updateEventStatus = async (id: string, status: string) => {
    setError(null);
    try {
      const { event } = await eventsService.updateEventStatus(id, status);
      setEvents(prev => prev.map(e => e.id === id ? event : e));
      return event;
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update event status');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    setError(null);
    try {
      await eventsService.deleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete event');
      throw err;
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return {
    events,
    loading,
    error,
    fetchEvents,
    createEvent,
    updateEventStatus,
    deleteEvent
  };
};