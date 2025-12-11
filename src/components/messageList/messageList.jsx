import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChatStore } from '../../store/useChatStore';
import './messageList.scss';

export const MessageList = () => {
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();

  const chats = useChatStore(s => s.chats);
  const loadChats = useChatStore(s => s.loadChats);

  useEffect(() => {
    loadChats();
  }, []);

  return (
    <div className='tg-chat-list'>
      <div className='tg-header'>Сообщения</div>

      <div className='tg-chats'>
        {chats.map(chat => (
          <div
            key={chat.id}
            className={`tg-chat-item ${
              Number(activeChatId) === chat.id ? 'active' : ''
            }`}
            onClick={() => navigate(`/message/${chat.id}`)}
          >
            <img
              className='tg-avatar'
              src={
                chat.avatar ||
                'https://cdn-icons-png.flaticon.com/512/3177/3177440.png'
              }
            />

            <div className='tg-chat-info'>
              <div className='tg-chat-top'>
                <span className='tg-chat-name'>{chat.title || 'Чат'}</span>
              </div>

              <div className='tg-chat-last'>
                {chat.lastMessage || 'Нет сообщений'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
