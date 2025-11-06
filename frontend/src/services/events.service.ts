import { api } from './api';
import { Event } from '../types';

export const eventsService = {
  async getEvents(status?: string): Promise<{ events: Event[] }> {
    const params = status ? { status } : {};
    const response = await api.get<{ events: Event[] }>('/events', { params });
    return response.data;
  },

  async createEvent(eventData: {
    title: string;
    startTime: string;
    endTime: string;
    status?: string;
  }): Promise<{ event: Event }> {
    const response = await api.post<{ event: Event }>('/events', eventData);
    return response.data;
  },

  async updateEvent(id: string, eventData: Partial<Event>): Promise<{ event: Event }> {
    const response = await api.put<{ event: Event }>(`/events/${id}`, eventData);
    return response.data;
  },

  async deleteEvent(id: string): Promise<{ message: string }> {
    const response = await api.delete<{ message: string }>(`/events/${id}`);
    return response.data;
  },

  async updateEventStatus(id: string, status: string): Promise<{ event: Event }> {
    const response = await api.patch<{ event: Event }>(`/events/${id}/status`, { status });
    return response.data;
  }
};