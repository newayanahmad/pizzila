import React, { useContext, useEffect, useState } from 'react';
import '../components/css/UserDashboard.css';
import { GiFullPizza } from 'react-icons/gi'
import { FaBoxOpen } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SocketContext from '../../context/SocketContext';

// ... Orders and Inventory components ...
function Orders() {
    const [orders, setOrders] = useState([])
    const navigation = useNavigate()

    const [socket] = useContext(SocketContext);
    // Function to set up the socket and handle the "orders" event
    const setupSocket = () => {
        socket.on("AdminOrders", (data) => {
            console.table(data.order);
            const newOrder = data.order
            // console.log(orders.length)
            console.log(data.isUpdate);
            if (data.isUpdate) {
                setOrders((prev) => {
                    return prev.map(order => {
                        if (order._id === newOrder._id) {
                            return newOrder
                        }
                        return order
                    })
                })
            }
            else {
                setOrders((prev) => {
                    return [newOrder, ...prev]
                })
            }
        });
    };

    useEffect(() => {
        const fetchOrders = async () => {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getorders`, {
                method: 'POST',
                headers: { user: localStorage.getItem('token') }
            })
            const data = await r.json()
            if (!data.success) navigation("../admin/login")
            setOrders(data.orders)
            setupSocket()
        }
        fetchOrders()
    }, [])

    return (
        <>
            <h2>Admin Dashboard</h2> <hr />
            <h3>Orders</h3>
            <div className="orders">
                {orders.map((order, index) => (<>
                    <div className="order-card" style={{ marginLeft: 0 }} key={order._id} onClick={() => navigation(order._id)}>
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

function Inventory() {
    const [inventory, setInventory] = useState([])
    const [socket] = useContext(SocketContext)
    const setupSocket = () => {
        socket.on('inventory', (data) => {
            setInventory(data.inventory)
        })
    }

    useEffect(() => {
        const fetchInventory = async () => {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-inventory`, {
                method: 'POST',
            })
            const data = await r.json()
            setInventory(data)
            setupSocket()
        }
        fetchInventory()
    }, [])

    return (
        <div className='inventory'>

            <h2>Admin Dashboard</h2> <hr />
            <h3 >Inventory</h3>

            <div className='orders'>
                <table style={{ width: "max-content", minWidth: "70%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ backgroundColor: "#000" }}>
                            <th style={{ border: "1px solid #000", padding: "8px", color: 'white' }}>Name</th>
                            <th style={{ border: "1px solid #000", padding: "8px", color: 'white' }}>Quantity</th>
                            <th style={{ border: "1px solid #000", padding: "8px", color: 'white' }}>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventory.map(item => (
                            <tr key={item._id} >
                                <td style={{ border: "1px solid #000", padding: "8px", color: item.quantity <= 20 ? 'red' : 'black' }}>{item.ingredient}</td>
                                <td style={{ border: "1px solid #000", padding: "8px", color: item.quantity <= 20 ? 'red' : 'black' }}>{item.quantity}</td>
                                <td style={{ border: "1px solid #000", padding: "8px", color: item.quantity <= 20 ? 'red' : 'black' }}>₹{item.price}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <br />
                <br />

            </div>
        </div>
    );
}

function AdminDashboard() {
    const navigation = useNavigate()
    const [queryParameters] = useSearchParams()
    let section = queryParameters.get('section')
    console.log(section);

    useEffect(() => {
        const checkAdmin = async () => {
            let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verifyadmin`, {
                method: 'POST',
                headers: { token: localStorage.getItem('token') }
            })
            let result = await res.json()
            if (!result.success) {
                navigation('../admin/login')
            }
        }
        checkAdmin()
    }, [])

    return (<>
        <div className="app">
            <div className="sidebar">
                <button className="sidebar-button" onClick={() => navigation('../admin/dashboard')}><GiFullPizza className='icon' /><p>Orders</p></button>
                <button className="sidebar-button" onClick={() => navigation('../admin/dashboard?section=inventory')}><FaBoxOpen className='icon' /><p>Inventory</p></button>
                <button className="sidebar-button" style={{ whiteSpace: 'normal' }} onClick={() => navigation('../admin/dashboard/create-pizza')}><FaBoxOpen className='icon' /><p >Add Pizza</p></button>
            </div>
            <div className="content">
                {section === 'inventory' ? <Inventory /> : <Orders />}
            </div>
        </div>
    </>
    );
}

export default AdminDashboard;
