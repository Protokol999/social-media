import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import api from './api';
import { ForgotPassword } from './components/forgotPassword/forgotPassword';
import { Navbar } from './components/navbar/navbar';
import { Registration } from './components/registration/registration';
import { ResetPassword } from './components/resetPassword/resetPassword';
import { UpdateUser } from './components/updateUser/updateUser';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Message } from './pages/message/message';
import { Profile } from './pages/profile/profile';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isNewUser = localStorage.getItem('isNewUser') === 'true';

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get('/auth/me'); // ✅ через api.js
        setUser(res.data);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    const token = localStorage.getItem('accessToken');
    if (token) fetchUser();
    else setLoading(false);
  }, []);

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar setUser={setUser} />
        <Routes>
          <Route
            path='/'
            element={
              !user ? (
                <Navigate to='/login' />
              ) : (
                <Home />
              )
            }
          />

          {/* Приватные маршруты */}
          <Route
            path='/home'
            element={user ? <Home /> : <Navigate to='/login' />}
          />
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
              !user ? <Login setUser={setUser} /> : <Navigate to='/home' />
            }
          />
          <Route
            path='/registration'
            element={
              !user ? (
                <Registration setUser={setUser} />
              ) : isNewUser ? (
                <Navigate to='/update-user' />
              ) : (
                <Navigate to='/home' />
              )
            }
          />
          <Route
            path='/forgot-password'
            element={!user ? <ForgotPassword /> : <Navigate to='/home' />}
          />
          <Route
            path='/reset-password'
            element={!user ? <ResetPassword /> : <Navigate to='/home' />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
