import axios from 'axios';
import { useState } from 'react';
import './registration.scss';
export const Registration = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async e => {
    e.preventDefault();
    try {
      const response = await axios.post(
        'https://b8203d5a8b30.ngrok-free.app/api/v1/auth/register',
        {
          email,
          username,
          password
        }
      );
      console.log('Успех', response.data);
      localStorage.setItem('token', response.data.token);
      alert('Вы успешно вошли в систему');

      setEmail('');
      setUsername('');
      setPassword('');
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
