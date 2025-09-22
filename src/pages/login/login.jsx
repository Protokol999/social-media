import axios from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.scss';
export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleLogin = async e => {
    e.preventDefault();
    if (!email || !password) {
      setError('Пожалуйста, заполните все поля');
      return;
    }
    try {
      const response = await axios.post(
        'https://cd24861818d7.ngrok-free.app/api/v1/auth/login',
        {
          email,
          password
        }
      );

      const accessToken = response.data.accessToken;
      localStorage.setItem('accessToken', accessToken);
      const profileResponse = await axios.get(
        'https://cd24861818d7.ngrok-free.app/api/v1/auth/me',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'ngrok-skip-browser-warning': 'true'
          }
        }
      );

      localStorage.setItem('userId', profileResponse.data.id);
      console.log(profileResponse.data);
      console.log(localStorage.getItem('userId'));

      setEmail('');
      setPassword('');
      setError('');
      navigate('/update-user');
    } catch (error) {
      setError(error.response?.data?.message || 'Неверный логин или пароль');
    }
  };
  return (
    <section className='login'>
      <div className='login-container'>
        <div className='login__header'>
          <h1 className='login__title'>GS Social</h1>
          <h2>Добро пожаловать на нашу социальную сеть</h2>
        </div>
        <div className='login__form-container'>
          <form className='login__form' onSubmit={handleLogin}>
            <input
              type='text'
              placeholder='Email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <input
              type='password'
              placeholder='Пароль'
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            {error && <div className='login__error'>{error}</div>}
            <Link className='login__forgot-password' to='/forgot-password'>
              Забыли пароль?
            </Link>
            <button type='submit'>Войти</button>
            <hr />
            <span className='login__register-prompt'>
              Либо пройдите регистрацию если у вас нет аккаунта
              <br />
              <Link to='/registration'>Зарегистрироваться</Link>
            </span>
          </form>
        </div>
      </div>
    </section>
  );
};
