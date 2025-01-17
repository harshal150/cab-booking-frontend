import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Checkout from './components/Checkout';
import PassangersDetails from './components/PassangersDetails';
import PaymentComponent from './components/payment.js/PaymentForm';
import PaymentSuccess from './components/payment.js/PaymentSuccess';

import FinalPaymentSuccess from './components/payment.js/FinalPaymentSuccess';

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/" element={<Home />} />
          {/* <Route path="/checkout" element={<Checkout />} /> */}
          <Route path="/passangers" element={<PassangersDetails />} />



          <Route path="/checkout" element={<PaymentComponent />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/finalpaymentsuccess" element={<FinalPaymentSuccess />} />
              
        </Routes>
      </div>
    </Router>
  );
}

export default App;
