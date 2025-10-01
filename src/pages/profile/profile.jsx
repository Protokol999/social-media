import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../../components/sidebar/sidebar'; // ⚡ Исправлен путь к 'sidebar' и 'Sidebar'
import './profile.scss'; // ⚡ Исправлен путь к './profile.scss'

export const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!currentUserId) {
          setLoading(false);
          console.error('ID пользователя не найден.');
          return;
        }
        const response = await axios.get(
          `https://c8e85948dcc9.ngrok-free.app/api/v1/users/${currentUserId}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'ngrok-skip-browser-warning': 'true'
            }
          }
        );
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
      {/* ⚡ ГЛАВНЫЙ КОНТЕЙНЕР СПРАВА: Содержит все блоки профиля */}
      <div className='profile-main-content-wrapper'>
        {/* ⚡ Блок Обложки (для наложения аватара) */}
        <div className='cover'></div>

        {/* Хедер: Аватар, Имя, Кнопки */}
        <div className='profile-header'>
          <div className='avatar'>
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt='avatar' />
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
              <button onClick={() => navigate('/updateUser')}>
                Редактировать профиль
              </button>
              <button>Добавить в друзья</button>
              <button>Сообщение</button>
            </div>
          </div>
        </div>

        {/* Основной контент (Колонки под хедером) */}
        <div className='profile-content'>
          {/* Левая колонка */}
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

          {/* Правая колонка */}
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
