import axios from 'axios';
import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import { ForgotPassword } from './components/forgotPassword/forgotPassword';
import { Navbar } from './components/navbar/navbar';
import { Registration } from './components/registration/registration';
import { ResetPassword } from './components/resetPassword/resetPassword';
import { UpdateUser } from './components/updateUser/updateUser';
import { Login } from './pages/login/login';
import { Message } from './pages/message/message';
import { Profile } from './pages/profile/profile';

// ⚡ Добавим заглушку для страницы Home
const Home = () => <div>Добро пожаловать домой!</div>;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      axios
        .get('https://c8e85948dcc9.ngrok-free.app/api/v1/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          }
        })
        .then(res => {
          setUser(res.data);
        })
        .catch(() => {
          localStorage.removeItem('accessToken');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Загрузка...</div>;
  }

  // ⚡ Проверка, новый ли пользователь (логика оставлена как в оригинале)

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar setUser={setUser} />
        <Routes>
          {/* Главная: если авторизован → /home, иначе → /login */}
          <Route
            path='/'
            element={
              user ? (
                // ⚡ Если авторизован, перенаправляем на /home
                <Navigate to='/home' />
              ) : (
                <Navigate to='/login' />
              )
            }
          />

          {/* ⚡ Добавляем маршрут /home */}
          <Route
            path='/home'
            element={user ? <Home /> : <Navigate to='/login' />}
          />

          {/* Приватные маршруты */}
          <Route
            path='/message'
            element={user ? <Message /> : <Navigate to='/login' />}
          />
          <Route
            path='/profile'
            element={user ? <Profile /> : <Navigate to='/login' />}
          />
          <Route
            path='/update-user'
            element={user ? <UpdateUser /> : <Navigate to='/login' />}
          />

          {/* Публичные маршруты */}
          <Route
            path='/login'
            element={
              // ⚡ Если авторизован, перенаправляем на /home
              !user ? <Login setUser={setUser} /> : <Navigate to='/home' />
            }
          />
          <Route
            path='/registration'
            element={
              // ⚡ Если авторизован, перенаправляем на /home (или на /update-user, если это логика для нового пользователя)
              // Использую /home для унификации, как вы просили. Если нужна логика с /update-user, верните ее.
              !user ? (
                <Registration setUser={setUser} />
              ) : (
                // <Navigate to='/update-user' /> // было
                <Navigate to='/home' /> // стало
              )
            }
          />
          <Route
            path='/forgot-password'
            element={
              // ⚡ Если авторизован, перенаправляем на /home
              !user ? <ForgotPassword /> : <Navigate to='/home' />
            }
          />
          <Route
            path='/reset-password'
            element={
              // ⚡ Если авторизован, перенаправляем на /home
              !user ? <ResetPassword /> : <Navigate to='/home' />
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
