import { bookingService } from './bookingService';

interface Notification {
  id: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  bookingId?: number;
}

class NotificationService {
  private notifications: Notification[] = [];
  private listeners: ((notifications: Notification[]) => void)[] = [];

  addListener(callback: (notifications: Notification[]) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  private notify() {
    this.listeners.forEach(callback => callback([...this.notifications]));
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    this.notifications.unshift(newNotification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }

    this.notify();
    
    // Show browser notification if permission granted
    this.showBrowserNotification(newNotification);
  }

  markAsRead(notificationId: string) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notify();
    }
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.read = true);
    this.notify();
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  private async showBrowserNotification(notification: Notification) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/logo.png',
        badge: '/logo.png',
        tag: notification.id,
      });
    }
  }

  async requestPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Simulate real-time notifications by polling pending bookings
  async startPolling(kolId: string, intervalMs: number = 30000) {
    let lastPendingCount = 0;

    const poll = async () => {
      try {
        const { count, bookings } = await bookingService.getPendingBookings(kolId);
        
        // If there are new pending bookings
        if (count > lastPendingCount) {
          const newBookings = bookings.slice(0, count - lastPendingCount);
          
          newBookings.forEach(booking => {
            this.addNotification({
              type: 'booking_request',
              title: 'New Booking Request',
              message: `${booking.client?.displayName} wants to book a session with you for ${booking.durationMinutes} minutes`,
              bookingId: booking.id
            });
          });
        }
        
        lastPendingCount = count;
      } catch (error) {
        console.error('Error polling for notifications:', error);
      }
    };

    // Initial poll
    poll();
    
    // Set up interval
    const intervalId = setInterval(poll, intervalMs);
    
    return () => clearInterval(intervalId);
  }

  // Create notifications for booking status changes
  notifyBookingAccepted(clientName: string, bookingDetails: string) {
    this.addNotification({
      type: 'booking_accepted',
      title: 'Booking Accepted',
      message: `Your booking request with ${clientName} has been accepted. ${bookingDetails}`
    });
  }

  notifyBookingRejected(kolName: string, reason?: string) {
    this.addNotification({
      type: 'booking_rejected',
      title: 'Booking Rejected',
      message: `Your booking request with ${kolName} was rejected. ${reason ? `Reason: ${reason}` : ''}`
    });
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  clearAllNotifications() {
    this.notifications = [];
    this.notify();
  }
}

export const notificationService = new NotificationService();
export type { Notification };