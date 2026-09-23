import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { sampleNotifications } from '../data/notifications';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    try {
      const stored = localStorage.getItem('edunova_notifications');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.warn('Error reading notifications', e);
    }
    return sampleNotifications.map(n => ({ ...n, unread: !n.read }));
  });

  useEffect(() => {
    try {
      localStorage.setItem('edunova_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Error saving notifications', e);
    }
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read && n.unread !== false).length;
  }, [notifications]);

  const markRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true, unread: false } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, read: true, unread: false }))
    );
  }, []);

  const addNotification = useCallback((notif) => {
    const newNotif = {
      id: `notif_${Date.now()}`,
      timeAgo: 'Just now',
      time: 'Just now',
      read: false,
      unread: true,
      accent: '#06b6d4',
      ...notif
    };
    setNotifications((prev) => [newNotif, ...prev]);
  }, []);

  const contextValue = useMemo(() => ({
    notifications,
    unreadCount,
    markRead,
    markAllAsRead,
    addNotification
  }), [notifications, unreadCount, markRead, markAllAsRead, addNotification]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);

