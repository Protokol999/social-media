import { Outlet } from 'react-router-dom';
import { MessageList } from '../../components/messageList/messageList';
import './message.scss';

export const Message = () => {
  return (
    <div className='tg-layout'>
      <div className='tg-left'>
        <MessageList />
      </div>

      {/* Правая колонка – либо чат либо заглушка */}
      <div className='tg-right'>
        <Outlet />
      </div>
    </div>
  );
};
