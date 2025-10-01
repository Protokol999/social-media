import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logo } from '../../assets';
import './registration.scss';

export const Registration = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://c8e85948dcc9.ngrok-free.app/api/v1/auth/register',
        { email, username, password }
      );

      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);

      const profileResponse = await axios.get(
        'https://c8e85948dcc9.ngrok-free.app/api/v1/auth/me',
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      localStorage.setItem('userId', profileResponse.data.id);
      localStorage.setItem('isNewUser', 'true'); // ⚡ пометка нового пользователя
      setUser(profileResponse.data);

      setEmail('');
      setUsername('');
      setPassword('');

      navigate('/update-user'); // редирект на update-user
    } catch (error) {
      console.error(
        'Ошибка при регистрации',
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || 'Ошибка при регистрации');
    }
  };

  return (
    <section className='registration'>
      <div className='registration-container'>
        <img className='registration__image' src={logo} alt='logo' />
        <div className='registration__form'>
          <div className='registration__header'>
            <h1 className='registration__title'>GS Social</h1>
            <h2>Пройдите пожалуйста регистрацию</h2>
          </div>
          <form className='registration__form' onSubmit={handleRegister}>
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type='text'
              placeholder='Логин'
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type='password'
              placeholder='Пароль'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type='submit'>Зарегистрироваться</button>
          </form>
        </div>
      </div>
    </section>
  );
};
