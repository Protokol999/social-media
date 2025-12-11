import { create } from 'zustand';
import { createNotificationStream } from '../notification/stream';
import * as NotifAPI from './api';

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  stopFn: null,
  isStreaming: false,

  // =========================
  // Загрузка истории
  // =========================
  loadNotifications: async () => {
    try {
      const list = await NotifAPI.listNotifications();

      const normalized = list.map(n => ({
        id: n.id,
        userId: n.userId,
        type: n.type,
        referenceId: n.referenceId || null,
        content: n.content,
        read: n.read === true,
        createdAt: n.createdAt
      }));

      set({
        notifications: normalized,
        unreadCount: normalized.filter(n => !n.read).length
      });
    } catch (err) {
      console.error('Ошибка загрузки уведомлений:', err);
    }
  },

  // =========================
  // Запуск real-time stream
  // =========================
  startStream: () => {
    if (get().isStreaming) return;

    console.log('🔔 Starting notification stream...');

    const stopFn = createNotificationStream({
      onMessage: async notif => {
        console.log('🔔 Stream received:', notif);

        // Только обновляем серверные данные
        await get().loadNotifications();
      },

      onError: () => {
        console.warn('Stream error → reconnecting in 3s...');
        set({ isStreaming: false, stopFn: null });
        setTimeout(() => get().startStream(), 3000);
      }
    });

    set({ stopFn, isStreaming: true });
  },

  // =========================
  // Остановка стрима
  // =========================
  stopStream: () => {
    const stop = get().stopFn;
    if (stop) stop(); // вызывает stream.cancel()
    set({ stopFn: null, isStreaming: false });
  },

  // =========================
  // Mark as read
  // =========================
  markAsRead: async id => {
    try {
      await NotifAPI.markAsRead(id);

      set(state => {
        const updated = state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        );
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.read).length
        };
      });
    } catch (err) {
      console.error('Ошибка markAsRead:', err);
    }
  },

  // =========================
  // Delete single
  // =========================
  deleteNotification: async id => {
    try {
      await NotifAPI.deleteNotification(id);

      set(state => {
        const updated = state.notifications.filter(n => n.id !== id);
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.read).length
        };
      });
    } catch (err) {
      console.error('Ошибка deleteNotification:', err);
    }
  },

  // =========================
  // Clear all
  // =========================
  clearAll: async () => {
    try {
      await NotifAPI.clearAll();
      set({ notifications: [], unreadCount: 0 });
    } catch (err) {
      console.error('Ошибка clearAll:', err);
    }
  }
}));
if (typeof window !== 'undefined') {
  window.useNotificationStore = useNotificationStore;
}
