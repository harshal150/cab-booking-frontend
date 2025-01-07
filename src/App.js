import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './components/Checkout';
import PassangersDetails from './components/PassangersDetails';
function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/passangers" element={<PassangersDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
