import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api'; // ⚡ используем api.js
import { Sidebar } from '../../components/sidebar/sidebar';
import './profile.scss';

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUserId) {
        setLoading(false);
        console.error('ID пользователя не найден.');
        return;
      }

      try {
        // ✅ Запрос через api.js, токен ставится автоматически
        const response = await api.get(`/users/${currentUserId}`);
        setUser(response.data);
      } catch (err) {
        console.error('Ошибка загрузки профиля:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [currentUserId]);

  if (loading) return <p className='loading'>Загрузка...</p>;
  if (!user) return <p className='error'>Пользователь не найден</p>;

  return (
    <div className='profile-container'>
      <Sidebar />
      <div className='profile-main-content-wrapper'>
        <div className='cover'></div>

        <div className='profile-header'>
          <div className='avatar'>
            {user.avatarUrl || user.avatar || user.base64Avatar ? (
              <img
                src={
                  user.avatarUrl ||
                  user.avatar ||
                  `data:image/jpeg;base64,${user.base64Avatar}`
                }
                alt='avatar'
              />
            ) : (
              <div className='avatar-placeholder'>
                {user.firstName?.[0]}
                {user.lastName?.[0]}
              </div>
            )}
          </div>
          <div className='header-info'>
            <h2>
              {user.firstName} {user.lastName}
            </h2>
            <div className='header-buttons'>
              <button onClick={() => navigate('/update-user')}>
                Редактировать профиль
              </button>
              <button>Добавить в друзья</button>
              <button>Сообщение</button>
            </div>
          </div>
        </div>

        <div className='profile-content'>
          <div className='left-column'>
            <div className='info-card'>
              <h3>Информация</h3>
              <p>
                <b>Дата рождения:</b> {user.birthDate || 'Не указана'}
              </p>
              <p>
                <b>О себе:</b> {user.bio || 'Пока нет информации'}
              </p>
            </div>
            <div className='info-card'>
              <h3>Соцсети</h3>
              {user.socialLinks ? (
                <ul>
                  {user.socialLinks.map((link, i) => (
                    <li key={i}>
                      <a href={link} target='_blank' rel='noreferrer'>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Пользователь не добавил соц.сети</p>
              )}
            </div>
          </div>

          <div className='right-column'>
            <div className='posts-card'>
              <h3>Посты</h3>
              <p>Пользователь пока ничего не публиковал</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
