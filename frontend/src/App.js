import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import InvoiceList from './components/InvoiceList';
import SignatureVerification from './pages/SignatureVerification';
import './styles/globals.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<InvoiceList />} />
            <Route path="/verify-signature" element={<SignatureVerification />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;
