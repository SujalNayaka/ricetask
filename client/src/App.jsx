import { BrowserRouter, Routes, Route } from 'react-router-dom'
import SellerLogin from './components/seller/SellerLogin'
import BuyerLogin from './components/buyer/BuyerLogin'
import LorryLogin from './components/lorry/LorryLogin'
import SellerDashboard from './components/seller/SellerDashboard'
import BuyerDashboard from './components/buyer/BuyerDashboard'
import LorryDashboard from './components/lorry/LorryDashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route */}
        <Route path="/" element={<BuyerLogin />} />
        
        {/* Seller routes */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        
        {/* Buyer routes */}
        <Route path="/buyer/login" element={<BuyerLogin />} />
        <Route path="/buyer/dashboard" element={<BuyerDashboard />} />
        
        {/* Lorry routes */}
        <Route path="/lorry/login" element={<LorryLogin />} />
        <Route path="/lorry/dashboard" element={<LorryDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App