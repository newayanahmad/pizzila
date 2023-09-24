import React, { useContext, useEffect, useState } from 'react';
import '../components/css/UserDashboard.css';
import { GiFullPizza } from 'react-icons/gi'
import { FaUserAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

function Orders() {
    const navigation = useNavigate()
    const [orders, setOrders] = useState([])
    useEffect(() => {
        const fetchOrders = async (req, res) => {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-orders`, {
                method: 'POST',
                headers: { user: localStorage.getItem('token') }
            })
            const data = await r.json()
            setOrders(data)
        }
        fetchOrders()
    }, [])
    return (
        <>
            <h2 style={{ paddingLeft: '10px', textDecoration: 'underline' }}>Orders</h2>
            <div className="orders">
                {orders.map((order, index) => (<>
                    <div className="order-card" key={index} onClick={() => navigation(order._id)}>
                        <div className="left">

                            <p className='order-items'>{order.items.map(item => item.name).join(', ')}</p>
                            <p className='order-date'>Date: {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Kolkata' })}</p>
                        </div >
                        <div className="right">

                            <p className='order-total'>Amount: ₹{parseInt(order.subtotal)}</p>
                            <p style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}><b>Status: {order.orderStatus}</b></p>
                        </div>
                    </div>

                </>
                ))}
                <br />
            </div>

        </>
    );
}

function OrdersComponent() {
    const navigation = useNavigate()
    const [isLoggedIn] = useContext(AuthContext)
    const [user, setUser] = useState({})


    useEffect(() => {
        const checkUser = async () => {
            let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verifyuser`, {
                method: 'POST',
                headers: { token: localStorage.getItem('token') }
            })
            let result = await res.json()
            if (!result.userValid) {
                navigation('../login')
            }
        }
        checkUser()
    }, [isLoggedIn])

    useEffect(() => {
        document.title = 'Orders | Pizzila'
        const fetchUser = async (req, res) => {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-user`, {
                method: 'POST',
                headers: { user: localStorage.getItem('token') }
            })
            const data = await r.json()
            setUser(data)
        }
        fetchUser()
    }, [])

    return (<>
        <div className="app">
            <div className="sidebar">
                <button className="sidebar-button" onClick={() => navigation('../dashboard/profile')}><FaUserAlt className='icon' /><p>Profile</p></button>
                <button className="sidebar-button" ><GiFullPizza className='icon' /><p>Orders</p></button>
            </div>
            <div className="content">
                <Orders />
            </div>
        </div>
    </>
    );
}

export default OrdersComponent;
