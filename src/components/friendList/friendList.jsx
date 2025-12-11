import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './friendList.scss';

export const FriendList = ({ onlyFollowing = false }) => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    try {
      const response = await api.get('/users');
      let list = response.data;
      if (onlyFollowing == true) {
        list = list.filter(user => user.isFollowing === true);
      }
      setFriends(list);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div>Загрузка...</div>;
  return (
    <div className='friend-list'>
      <h2 className='friend-list__title'>
        {onlyFollowing ? 'Мои подписки' : 'Все пользователи'}
      </h2>
      <ul className='friend-list__items'>
        {friends.map(friend => (
          <li key={friend.id} className='friend-list__item'>
            <img
              src={friend.avatarUrl || 'default-avatar.png'}
              alt='avatar'
              className='friend-list__avatar'
            />

            <div className='users-list__info'>
              <p className='users-list__name'>
                {user.firstName} {user.lastName}
              </p>

              <button
                className='users-list__profile-btn'
                onClick={() => navigate(`/profile/${user.id}`)}
              >
                Перейти
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
