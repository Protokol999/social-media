import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../api/api';
import { useChatStore } from '../../store/useChatStore';
import './chatPage.scss';

export const ChatPage = () => {
  const { id } = useParams();
  const chatId = Number(id);

  const [chat, setChat] = useState(null);
  const [text, setText] = useState('');

  const messages = useChatStore(s => s.messages[chatId] || []);
  const loadMessages = useChatStore(s => s.loadMessages);
  const sendMessage = useChatStore(s => s.sendMessage);
  const setActiveChat = useChatStore(s => s.setActiveChat);

  const messagesRef = useRef(null);

  // загрузка данных чата
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await api.get(`/chats/${id}`);
        setChat(res.data);
      } catch (err) {
        console.error('Ошибка загрузки чата:', err);
      }
    };

    fetchChat();
  }, [id]);

  // загрузка сообщений при открытии чата
  useEffect(() => {
    loadMessages(chatId);
    setActiveChat(chatId);
  }, [id]);

  // автоскролл вниз при появлении сообщений
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(chatId, text);
    setText('');
  };

  return (
    <div className='tg-chat-page'>
      {/* HEADER */}
      <div className='tg-chat-header'>
        <img
          src={
            chat?.avatar ||
            'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'
          }
          className='tg-header-avatar'
        />
        <div className='tg-header-name'>{chat?.title || 'Чат'}</div>
      </div>

      {/* MESSAGES */}
      <div className='tg-messages' ref={messagesRef}>
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`tg-msg ${
              msg.senderId === Number(localStorage.getItem('userId'))
                ? 'mine'
                : ''
            } ${msg.status === 'failed' ? 'failed' : ''}`}
          >
            <div className='tg-msg-text'>
              {msg.text}
              {msg.status === 'pending' && (
                <span className='pending-dot'>...</span>
              )}
            </div>

            <div className='tg-msg-time'>
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className='tg-input-box'>
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder='Сообщение'
        />

        <button onClick={handleSend} className='tg-send-btn'>
          ➤
        </button>
      </div>
    </div>
  );
};
