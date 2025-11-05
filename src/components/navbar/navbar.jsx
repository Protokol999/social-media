import { BiHome, BiMessageRounded } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { IoIosNotifications, IoIosSearch } from 'react-icons/io';
import { FiLogOut } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
import { logo } from '../../assets/index';
import './navbar.scss';

export const Navbar = ({ setUser }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userId');
    setUser(null);
    navigate('/login');
  };

  return (
    <nav className='modern-navbar'>
      <div className='navbar-container'>
        <Link to='/' className='navbar-brand'>
          <img className='navbar-logo' src={logo} alt='GS Social' />
          <span className='navbar-title'>GS Social</span>
        </Link>

        <div className='navbar-search'>
          <IoIosSearch className='search-icon' />
          <input
            type='text'
            placeholder='Поиск...'
            className='search-input'
          />
        </div>

        <div className='navbar-actions'>
          <Link to='/' className='nav-icon-link' title='Главная'>
            <BiHome className='nav-icon' />
          </Link>
          
          <Link to='/message' className='nav-icon-link' title='Сообщения'>
            <BiMessageRounded className='nav-icon' />
          </Link>
          
          <div className='nav-icon-link notifications' title='Уведомления'>
            <IoIosNotifications className='nav-icon' />
            <span className='notification-badge'>3</span>
          </div>
          
          <Link to='/profile' className='nav-icon-link' title='Профиль'>
            <CgProfile className='nav-icon' />
          </Link>
          
          <button onClick={handleLogout} className='logout-btn' title='Выйти'>
            <FiLogOut className='nav-icon' />
          </button>
        </div>
      </div>
    </nav>
  );
};
