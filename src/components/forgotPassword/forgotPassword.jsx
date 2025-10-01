import axios from 'axios';
import { useState } from 'react';
import './forgotPassword.scss';
export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    if (!email) {
      setError('Пожалуйста,введите корректный email');
      return;
    }
    try {
      const response = await axios.post(
        'https://c8e85948dcc9.ngrok-free.app/api/v1/auth/forgot-password',
        {
          email
        }
      );
      console.log('Успех', response.data);
      setEmail('');
      setError('');
    } catch (error) {
      setError(error.response?.data?.message || 'Ошибка при отправке запроса');
    }
  };
  return (
    <section className='forgot-password'>
      <div className='forgot-password__container'>
        <div className='forgot-password__header'>
          <h1 className='forgot-password__title'>Восстановление пароля</h1>
          <form className='forgot-password__form' onSubmit={handleSubmit}>
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            {error && <div className='forgot-password__error'>{error}</div>}
            <button type='submit'>Отправить</button>
          </form>
        </div>
      </div>
    </section>
  );
};
