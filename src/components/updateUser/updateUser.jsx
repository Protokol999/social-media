import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './updateUser.scss';

export const UpdateUser = () => {
  // const [avatarUrl, setAvatarUrl] = useState(null);
  // const [preview, setPreview] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  // Предварительный просмотр аватара
  // const handleAvatarChange = e => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setAvatarUrl(file);
  //     setPreview(URL.createObjectURL(file));
  //   }
  // };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!firstName || !lastName) {
      setError('Пожалуйста, заполните обязательные поля.');
      return;
    }
    console.log('Submit clicked', { firstName, lastName, birthDate, bio });

    try {
      const accessToken = localStorage.getItem('accessToken');
      // let avatarBase64 = null;
      // if (avatarUrl) {
      //   avatarBase64 = await new Promise((resolve, reject) => {
      //     const reader = new FileReader();
      //     reader.readAsDataURL(avatarUrl);
      //     reader.onload = () => resolve(reader.result);
      //     reader.onerror = err => reject(err);
      //   });
      // }
      const userData = {
        firstName,
        lastName,
        birthDate: birthDate
          ? new Date(birthDate).toISOString().split('T')[0]
          : null,
        bio
        // avatar: avatarBase64
      };
      const response = await axios.patch(
        `https://c8e85948dcc9.ngrok-free.app/api/v1/users/${userId}`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      navigate(`/profile/${userId}`);
      console.log('Ответ сервера:', response.data);

      setSuccess('Профиль успешно обновлён!');
      setError('');
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError('Не удалось обновить профиль.');
      setSuccess('');
    }
  };

  return (
    <div className='profile-setup'>
      <h2>Заполните данные профиля</h2>
      {/* <div className='avatar-section'>
        {preview ? (
          <img src={preview} alt='avatar' className='avatar-preview' />
        ) : (
          <div className='avatar-placeholder'>Аватар</div>
        )}
        <input type='file' accept='image/*' onChange={handleAvatarChange} />
      </div> */}
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
