import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './components/HomePage';
import Calculator from './apps/Calculator';
import RainbowGenerator from './apps/RainbowGenerator';
import Solitaire from './apps/Solitaire';
import ArcadeGame from './apps/ArcadeGame';
import './App.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/rainbows" element={<RainbowGenerator />} />
          <Route path="/solitaire" element={<Solitaire />} />
          <Route path="/arcade" element={<ArcadeGame />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
