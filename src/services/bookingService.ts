import { API_BASE_URL } from './kolService';

export interface Booking {
  id: number;
  kolId: number;
  clientId: number;
  bookingDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  price: number;
  rejectionReason?: string;
  notes?: string;
  durationMinutes: number;
  timezone: string;
  createdAt: string;
  updatedAt: string;
  kol?: {
    id: number;
    displayName: string;
    avatarUrl: string;
  };
  client?: {
    id: number;
    displayName: string;
    avatarUrl: string;
  };
}

export interface CreateBookingRequest {
  kolId: string;
  clientId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  reason: string;
  durationMinutes: number;
  timezone?: string;
}

export interface UpdateBookingStatusRequest {
  status: 'accepted' | 'rejected' | 'completed' | 'cancelled';
  rejectionReason?: string;
  notes?: string;
}

export interface KOLPricingUpdate {
  pricePerSlot?: number;
  isAvailable?: boolean;
  minBookingDuration?: number;
  maxBookingDuration?: number;
  availabilitySchedule?: string;
}

class BookingService {
  async createBooking(bookingData: CreateBookingRequest): Promise<{ success: boolean; booking: Booking; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create booking');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getKOLBookings(kolId: string): Promise<{ bookings: Booking[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/kol/${kolId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch KOL bookings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching KOL bookings:', error);
      return { bookings: [] };
    }
  }

  async getClientBookings(clientId: string): Promise<{ bookings: Booking[] }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/client/${clientId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch client bookings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching client bookings:', error);
      return { bookings: [] };
    }
  }

  async getPendingBookings(kolId: string): Promise<{ bookings: Booking[]; count: number }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/kol/${kolId}/pending`);
      if (!response.ok) {
        throw new Error('Failed to fetch pending bookings');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
      return { bookings: [], count: 0 };
    }
  }

  async updateBookingStatus(bookingId: number, statusData: UpdateBookingStatusRequest): Promise<{ success: boolean; booking: Booking; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(statusData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update booking status');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating booking status:', error);
      throw error;
    }
  }

  async updateKOLPricing(kolId: string, pricingData: KOLPricingUpdate): Promise<{ success: boolean; kol: any; message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/kols/${kolId}/pricing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(pricingData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update pricing');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating KOL pricing:', error);
      throw error;
    }
  }

  async getBookingById(bookingId: number): Promise<{ booking: Booking }> {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${bookingId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch booking');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching booking:', error);
      throw error;
    }
  }

  formatDateTime(date: string, time: string): string {
    return new Date(`${date}T${time}`).toLocaleString();
  }

  calculateDuration(startTime: string, endTime: string): number {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return (end.getTime() - start.getTime()) / (1000 * 60);
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'accepted':
        return '#10b981';
      case 'rejected':
        return '#ef4444';
      case 'completed':
        return '#6366f1';
      case 'cancelled':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  }
}

export const bookingService = new BookingService();