import { AppBar } from '@mui/material';
import { BiHome, BiMessageRounded } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { IoIosNotifications, IoIosSearch } from 'react-icons/io';
import { MdLogin } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { logo } from '../../assets/index';
import './navbar.scss';
export const Navbar = () => {
  return (
    <AppBar
      position='static'
      className='navbar'
      sx={{
        boxShadow: 'none',
        background: 'linear-gradient(135deg, #74b9ff, #a29bfe)'
      }}
    >
      <div className='navbar-content'>
        <Link to='/'>
          <img className='navbar-logo' src={logo} alt='GS Media' />
        </Link>
        <div className='navbar-search'>
          <input
            className='navbar-search'
            type='text'
            placeholder='Search...'
          />
          <IoIosSearch size={20} style={{ cursor: 'pointer', color: '#000' }} />
        </div>
        <div className='navbar-notifications'>
          <IoIosNotifications size={30} style={{ cursor: 'pointer' }} />
          <span className='navbar-notifications-badge'>3</span>
        </div>
        <div className='navbar-links'>
          <Link to='/' style={{ color: 'inherit' }}>
            <BiHome size={30} style={{ cursor: 'pointer' }} />
          </Link>
          <Link to='/message' style={{ color: 'inherit' }}>
            <BiMessageRounded size={30} style={{ cursor: 'pointer' }} />
          </Link>
          <Link to='/profile' style={{ color: 'inherit' }}>
            <CgProfile size={30} style={{ cursor: 'pointer' }} />
          </Link>
          <Link to='/login' style={{ color: 'inherit' }}>
            <MdLogin size={30} style={{ cursor: 'pointer' }} />
          </Link>
          {/* <Link to='/update-user' style={{ color: 'inherit' }}>
            <MdLogin size={30} style={{ cursor: 'pointer' }} />
          </Link> */}
        </div>
      </div>
    </AppBar>
  );
};
