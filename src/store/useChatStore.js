import { create } from 'zustand';
import api from '../api/api';
import { createChatStream } from '../chat/stream';

export const useChatStore = create((set, get) => ({
  chats: [],
  messages: {}, // { chatId: [msg, msg...] }
  streams: {}, // active streams per chatId
  activeChat: null,

  // ================================
  // ЗАГРУЗКА СПИСКА ЧАТОВ
  // ================================
  loadChats: async () => {
    try {
      const res = await api.get('/chats');
      set({ chats: res.data.chats || [] });
    } catch (err) {
      console.error('Ошибка загрузки чатов:', err);
      set({ chats: [] });
    }
  },

  // ================================
  // ЗАГРУЗКА ИСТОРИИ СООБЩЕНИЙ
  // ================================
  loadMessages: async chatId => {
    try {
      const res = await api.get(`/chats/${chatId}/messages`);
      const list = res.data?.messages || res.data || [];

      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: list
        }
      }));
    } catch (err) {
      console.error('Ошибка загрузки сообщений:', err);
    }
  },

  // ================================
  // ОТПРАВКА СООБЩЕНИЯ
  // ================================
  sendMessage: async (chatId, text) => {
    const tempId = 'tmp_' + Math.random();

    const userId = localStorage.getItem('userId');

    // Добавляем сообщение как pending
    set(state => ({
      messages: {
        ...state.messages,
        [chatId]: [
          ...(state.messages[chatId] || []),
          {
            id: tempId,
            chatId,
            senderId: userId,
            text,
            createdAt: new Date().toISOString(),
            status: 'pending'
          }
        ]
      }
    }));

    try {
      const res = await api.post(`/chats/${chatId}/messages`, {
        content: text
      });
      const real = res.data;

      // Заменяем временное сообщение реальным
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].map(m =>
            m.id === tempId ? real : m
          )
        }
      }));
    } catch (err) {
      console.error('Ошибка отправки сообщения:', err);

      // Помечаем как failed
      set(state => ({
        messages: {
          ...state.messages,
          [chatId]: state.messages[chatId].map(m =>
            m.id === tempId ? { ...m, status: 'failed' } : m
          )
        }
      }));
    }
  },

  // ================================
  // АКТИВНЫЙ ЧАТ + СТРИМ
  // ================================
  setActiveChat: chatId => {
    const { streams } = get();

    // Закрываем предыдущий стрим
    Object.values(streams).forEach(cancel => cancel && cancel());

    // Сбрасываем стримы
    set({ streams: {}, activeChat: chatId });

    // Запускаем стрим только для выбранного чата
    const cancel = createChatStream(chatId, {
      onMessage: msg => {
        set(state => ({
          messages: {
            ...state.messages,
            [chatId]: [...(state.messages[chatId] || []), msg]
          },
          chats: state.chats.map(c =>
            c.id === chatId ? { ...c, lastMessage: msg.text } : c
          )
        }));
      },

      onError: err => {
        console.warn('Stream error — reconnect in 3s...', err);

        setTimeout(() => {
          get().setActiveChat(chatId);
        }, 3000);
      }
    });

    set(state => ({
      streams: {
        ...state.streams,
        [chatId]: cancel
      }
    }));
  },

  // ================================
  // ОСТАНОВИТЬ ВСЕ СТРИМЫ
  // ================================
  stopAllStreams: () => {
    const { streams } = get();
    Object.values(streams).forEach(cancel => cancel && cancel());
    set({ streams: {}, activeChat: null });
  }
}));
