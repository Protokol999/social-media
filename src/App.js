import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import { ForgotPassword } from './components/forgotPassword/forgotPassword';
import { Navbar } from './components/navbar/navbar';
import { Registration } from './components/registration/registration';
import { ResetPassword } from './components/resetPassword/resetPassword';
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Message } from './pages/message/message';
import { Profile } from './pages/profile/profile';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/message' element={<Message />} />
          <Route path='/profile' element={<Profile />} />
          <Route path='/login' element={<Login />} />
          <Route path='/registration' element={<Registration />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/reset-password' element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
