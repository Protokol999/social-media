import { AppBar } from '@mui/material';
import { BiHome, BiMessageRounded } from 'react-icons/bi';
import { CgProfile } from 'react-icons/cg';
import { IoIosSearch } from 'react-icons/io';

import './navbar.scss';
export const Navbar = () => {
  return (
    <AppBar position='static' className='navbar' sx={{ boxShadow: 'none' }}>
      <div className='navbar-content'>
        <h1 className='navbar-title'>GS Media</h1>
        <BiHome size={30} style={{ cursor: 'pointer' }} />
        <BiMessageRounded size={30} style={{ cursor: 'pointer' }} />
        <CgProfile size={30} style={{ cursor: 'pointer' }} />
        <div className='navbar-search'>
          <input
            className='navbar-search'
            type='text'
            placeholder='Search...'
          />
          <IoIosSearch size={20} style={{ cursor: 'pointer', color: '#000' }} />
        </div>
      </div>
    </AppBar>
  );
};
