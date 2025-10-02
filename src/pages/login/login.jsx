import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api';
import { logo } from '../../assets';
import './login.scss';

export const Login = ({ setUser }) => {
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
      // 1️⃣ Логин через api.js
      const response = await api.post('/auth/login', { email, password });
      const { accessToken, refreshToken } = response.data;

      // 2️⃣ Сохраняем токены
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // 3️⃣ Получаем профиль
      const profileResponse = await api.get('/auth/me');
      setUser(profileResponse.data);
      localStorage.setItem('userId', profileResponse.data.id);

      // 4️⃣ Очистка формы и переход
      setEmail('');
      setPassword('');
      setError('');
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Неверный логин или пароль');
    }
  };

  return (
    <section className='login'>
      <div className='login-container'>
        <img className='login__image' src={logo} alt='logo' />
        <div className='login__form'>
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
      </div>
    </section>
  );
};
