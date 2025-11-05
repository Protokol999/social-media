import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaUserPlus, FaEnvelope, FaBirthdayCake, FaInfoCircle, FaGlobe } from 'react-icons/fa';
import api from '../../api';
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

  if (loading) {
    return (
      <div className='profile-container'>
        <Sidebar />
        <div className='loading-wrapper'>
          <div className='spinner'></div>
          <p>Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className='profile-container'>
        <Sidebar />
        <div className='error-wrapper'>
          <p>Пользователь не найден</p>
        </div>
      </div>
    );
  }

  return (
    <div className='profile-container'>
      <Sidebar />
      <div className='profile-main-content'>
        {/* Cover with gradient */}
        <div className='cover-section'>
          <div className='cover-gradient'></div>
        </div>

        {/* Profile Header */}
        <div className='profile-header'>
          <div className='avatar-wrapper'>
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
            <div className='avatar-ring'></div>
          </div>

          <div className='user-info'>
            <h1 className='user-name'>
              {user.firstName} {user.lastName}
            </h1>
            <p className='user-username'>@{user.username || 'user'}</p>
          </div>

          <div className='action-buttons'>
            <button className='btn btn-primary' onClick={() => navigate('/update-user')}>
              <FaEdit /> Редактировать
            </button>
            <button className='btn btn-secondary'>
              <FaUserPlus /> Добавить в друзья
            </button>
            <button className='btn btn-secondary'>
              <FaEnvelope /> Сообщение
            </button>
          </div>
        </div>

        {/* Profile Content Grid */}
        <div className='profile-grid'>
          {/* Left Column - Info Cards */}
          <div className='info-section'>
            <div className='card info-card'>
              <div className='card-header'>
                <FaInfoCircle className='card-icon' />
                <h3>Информация</h3>
              </div>
              <div className='card-body'>
                <div className='info-item'>
                  <FaBirthdayCake className='info-icon' />
                  <div>
                    <span className='info-label'>Дата рождения</span>
                    <p className='info-value'>{user.birthDate || 'Не указана'}</p>
                  </div>
                </div>
                <div className='info-item'>
                  <FaInfoCircle className='info-icon' />
                  <div>
                    <span className='info-label'>О себе</span>
                    <p className='info-value'>{user.bio || 'Пока нет информации'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className='card info-card'>
              <div className='card-header'>
                <FaGlobe className='card-icon' />
                <h3>Соцсети</h3>
              </div>
              <div className='card-body'>
                {user.socialLinks && user.socialLinks.length > 0 ? (
                  <ul className='social-links'>
                    {user.socialLinks.map((link, i) => (
                      <li key={i}>
                        <a href={link} target='_blank' rel='noreferrer' className='social-link'>
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className='empty-state'>Пользователь не добавил соц.сети</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Posts */}
          <div className='posts-section'>
            <div className='card posts-card'>
              <div className='card-header'>
                <h3>Посты</h3>
                <span className='badge'>0</span>
              </div>
              <div className='card-body'>
                <div className='empty-posts'>
                  <div className='empty-icon'>📝</div>
                  <p>Пользователь пока ничего не публиковал</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
