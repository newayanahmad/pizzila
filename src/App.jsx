import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import HomePage from './Pages/HomePage'
import Cart from './Pages/Cart';
import Navbar from './components/Navbar';
import Register from './Pages/Register';
import Login from './Pages/Login';
import ForgetPassword from './components/ForgetPassword';

const App = () => {
  const [cart, setCart] = useState([
    { id: 1, name: 'Margherita', price: 299, image: 'ideogram (1).jpeg', quantity: 1 },
    { id: 2, name: 'Pepperoni', price: 199, image: 'ideogram (2).jpeg', quantity: 1 },
    { id: 3, name: 'Vegetarian', price: 289, image: 'ideogram (3).jpeg', quantity: 1 },
  ]);

  const updateQuantity = (itemToUpdate, change) => {
    setCart(cart.map(item =>
      item.id === itemToUpdate.id
        ? { ...item, quantity: Math.max(0, item.quantity + change) }
        : item
    ).filter(item => item.quantity > 0));
  };
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='cart' element={<Cart cart={cart} updateQuantity={updateQuantity} />} />
        <Route path='register' element={<Register />} />
        <Route path='login' element={<Login />} />
        <Route path='reset-password' element={<ForgetPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

const Nav = () => {
  const location = useLocation()
  if (location.pathname == '/register' || location.pathname == '/login' || location.pathname == '/reset-password') {
    return (<></>)
  }
  return <Navbar />
}

export default App