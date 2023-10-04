import React, { useState, lazy, Suspense, useLayoutEffect, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import AuthContext from '../context/AuthContext';
import SubtotalContext from "../context/SubtotalContext"
import OrderIDContext from '../context/OrderIDContext';
import SocketContext from "../context/SocketContext";
// changing all the above lazy import to normal imports
import HomePage from './Pages/HomePage'
import Cart from './Pages/Cart'
import Navbar from './components/Navbar'
import Register from './Pages/Register'
import Login from './Pages/Login'
import ForgetPassword from './components/ForgetPassword'
import AdminLoginPage from './components/AdminLoginPage'
import Address from './components/Address'
const Payment = lazy(() => import('./Pages/Payment'))
const PaymentSuccess = lazy(() => import('./Pages/PaymentSuccess'))
import OrdersComponent from './Pages/Orders';
import CreatePizzaForm from './components/CreatePizzaForm'

import CartContext from '../context/CartContext'
import UserProfile from './Pages/UserProfile';
import Order from './Pages/Order';
import AdminDashboard from './Pages/AdminDashboard';
import AdminOrder from './Pages/AdminOrder';

import io from 'socket.io-client';


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // ... your existing code ...
  const [cart, setCart] = useState([]);
  const [orderID, setOrderID] = useState('')
  const [subtotal, setSubtotal] = useState(0);
  const [socket, setSocket] = useState(null);

  useLayoutEffect(() => {
    const checkUser = async () => {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verifyuser`, {
        method: 'POST',
        headers: { token: localStorage.getItem('token') }
      })
      let result = await res.json()
      if (result.userValid) {
        const socket = io(import.meta.env.VITE_BACKEND_URL, {
          query: {
            token: localStorage.getItem('token')
          }
        })
        setSocket(socket)
        socket.emit("demo", "hello from app.jsx")

        const d = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-cart-items`, {
          method: 'POST',
          headers: { user: localStorage.getItem('token') }
        })
        let r = await d.json()
        if (r.success) {
          setCart(r.cartItems)
        }
        else {
          setCart([]);
        }
        setIsLoggedIn(true)
      }
    }
    checkUser()
    return () => {
      // Disconnect on unmount or when the user logs out
      if (socket) {
        socket.disconnect();
      }
    };
  }, [isLoggedIn])

  return (
    <BrowserRouter>
      <AuthContext.Provider value={[isLoggedIn, setIsLoggedIn]}>
        <SocketContext.Provider value={[socket]}>
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
                    <Route path="dashboard" element={<DashBoard />} />
                    <Route path='dashboard/orders' element={<OrdersComponent />} />
                    <Route path='dashboard/orders/:orderID' element={<Order />} />
                    <Route path='dashboard/profile' element={<UserProfile />} />
                    <Route path='admin/login' element={<AdminLoginPage />} />
                    <Route path='admin/dashboard' element={<AdminDashboard />} />
                    <Route path='admin/dashboard/create-pizza' element={<CreatePizzaForm />} />
                    <Route path='admin/dashboard/:orderID' element={<AdminOrder />} />
                  </Routes>
                </Suspense>
              </OrderIDContext.Provider>
            </SubtotalContext.Provider>
          </CartContext.Provider>
        </SocketContext.Provider>
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

const DashBoard = () => {
  const navigation = useNavigate()
  useEffect(() => {
    navigation('profile')
  }, [])
  return <></>
}


export default App