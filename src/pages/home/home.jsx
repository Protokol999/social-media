import { Sidebar } from '../../components/sidebar/sidebar';
import './home.scss';
export const Home = () => {
  return (
    <section className='home'>
      <Sidebar />
      <h1 className='home__title'>Home Page</h1>
    </section>
  );
};
