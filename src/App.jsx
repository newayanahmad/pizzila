import React, { useState, lazy, Suspense, useLayoutEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import SubtotalContext from "../context/SubtotalContext"
import OrderIDContext from '../context/OrderIDContext';
const HomePage = lazy(() => import('./Pages/HomePage'));
const Cart = lazy(() => import('./Pages/Cart'));
const Navbar = lazy(() => import('./components/Navbar'));
const Register = lazy(() => import('./Pages/Register'));
const Login = lazy(() => import('./Pages/Login'));
const ForgetPassword = lazy(() => import('./components/ForgetPassword'));
const AdminLoginPage = lazy(() => import('./components/AdminLoginPage'));
const Address = lazy(() => import('./components/Address'));
const Payment = lazy(() => import('./Pages/Payment'));
const PaymentSuccess = lazy(() => import('./Pages/PaymentSuccess'));
import CartContext from '../context/CartContext'


const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // ... your existing code ...
  const [cart, setCart] = useState([]);
  const [orderID, setOrderID] = useState('')
  const [subtotal, setSubtotal] = useState(0);

  useLayoutEffect(() => {
    const checkUser = async () => {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verifyuser`, {
        method: 'POST',
        headers: { token: localStorage.getItem('token') }
      })
      let result = await res.json()
      if (result.userValid) {
        const d = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-cart-items`, {
          method: 'POST',
          headers: { user: localStorage.getItem('token') }
        })
        let r = await d.json()
        if (r.success) {
          setCart(r.cartItems)
        }
        setIsLoggedIn(true)
      }
    }
    checkUser()
  }, [])

  return (
    <BrowserRouter>
      <AuthContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
        <CartContext.Provider value={[cart, setCart]}>
          <SubtotalContext.Provider value={[subtotal, setSubtotal]}>
            <OrderIDContext.Provider value={[orderID, setOrderID]}>
              <Suspense fallback={<div className='spinner-box'><div className='loader' ></div></div>}>
                <Nav />
                <Routes>
                  <Route path='/' element={<HomePage />} />
                  <Route path='cart' element={<Cart />} />
                  <Route path='register' element={<Register />} />
                  <Route path='login' element={<Login />} />
                  <Route path='reset-password' element={<ForgetPassword />} />
                  <Route path='address' element={<Address />} />
                  <Route path='payment' element={<Payment />} />
                  <Route path='success' element={<PaymentSuccess />} />
                  <Route path='admin/login' element={<AdminLoginPage />} />
                </Routes>
              </Suspense>
            </OrderIDContext.Provider>
          </SubtotalContext.Provider>
        </CartContext.Provider>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

const Nav = () => {
  const location = useLocation()
  if (location.pathname == '/register' || location.pathname == '/login' || location.pathname == '/reset-password' || location.pathname == '/admin/login' || location.pathname == '/payment') {
    return (<></>)
  }
  return <Navbar />
}

export default App