import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api';
import './updateUser.scss';

export const UpdateUser = () => {
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [preview, setPreview] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      setAvatarUrl(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!firstName || !lastName) {
      setError('Пожалуйста, заполните обязательные поля.');
      return;
    }

    try {
      // 1. Обновление профиля через PATCH
      const userData = {
        firstName,
        lastName,
        birthDate: birthDate
          ? new Date(birthDate).toISOString().split('T')[0]
          : null,
        bio
      };

      await api.patch(`/users/${userId}`, userData);

      // 2. Загрузка аватара через POST
      if (avatarUrl) {
        const avatarBase64 = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(avatarUrl);
          reader.onload = () => resolve(reader.result);
          reader.onerror = err => reject(err);
        });

        const avatarData = {
          id: userId,
          avatar: avatarBase64.split(',')[1],
          filename: avatarUrl.name
        };

        await api.post(`/users/${userId}/avatar`, avatarData);
      }

      setSuccess('Профиль успешно обновлён!');
      setError('');
      navigate(`/profile/${userId}`);
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError('Не удалось обновить профиль.');
      setSuccess('');
    }
  };

  return (
    <div className='profile-setup'>
      <h2>Заполните данные профиля</h2>
      <div className='avatar-section'>
        {preview ? (
          <img src={preview} alt='avatar' className='avatar-preview' />
        ) : (
          <div className='avatar-placeholder'>Аватар</div>
        )}
        <input type='file' accept='image/*' onChange={handleAvatarChange} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className='row'>
          <input
            type='text'
            placeholder='Имя'
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
          />
          <input
            type='text'
            placeholder='Фамилия'
            value={lastName}
            onChange={e => setLastName(e.target.value)}
          />
        </div>
        <input
          type='date'
          placeholder='Дата рождения'
          value={birthDate}
          onChange={e => setBirthDate(e.target.value)}
        />
        <textarea
          placeholder='Краткая биография'
          value={bio}
          onChange={e => setBio(e.target.value)}
        />
        {error && <p className='error'>{error}</p>}
        {success && <p className='success'>{success}</p>}
        <button type='submit'>Сохранить профиль</button>
      </form>
    </div>
  );
};
