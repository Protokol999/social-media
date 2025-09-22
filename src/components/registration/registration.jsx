import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './registration.scss';
export const Registration = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://90fba30a4cff.ngrok-free.app/api/v1/auth/register',
        {
          email,
          username,
          password
        }
      );
      console.log('Успех', response.data);

      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      const profileResponse = await axios.get(
        `https://90fba30a4cff.ngrok-free.app/api/v1/auth/me`,
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );
      localStorage.setItem('userId', profileResponse.data.id);

      setEmail('');
      setUsername('');
      setPassword('');
      navigate('/update-user');
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
        <div className='registration__header'>
          <h1 className='registration__title'>GS Social</h1>
          <h2>Пройдите пожалуйста регистрацию</h2>
        </div>
        <div className='registration__form-container'>
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
