import './App.css';
import { Navbar } from './components/navbar/navbar';
import { Home } from './pages/home/home';

function App() {
  return (
    <div className='App'>
      <Navbar />
      <Home />
    </div>
  );
}

export default App;
