import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import "../components/css/Order.css"
import AuthContext from '../../context/AuthContext'
import SocketContext from '../../context/SocketContext'

const AdminOrder = () => {
    const [orderId, setOrderID] = useState("")
    const [order, setOrder] = useState(null)
    const { orderID } = useParams()
    const [isLoggedIn] = useContext(AuthContext)
    const [user, setUser] = useState(null)
    const navigation = useNavigate()
    const [socket] = useContext(SocketContext);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!localStorage.getItem('token')) return navigation('../admin/login')
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
    }, [isLoggedIn])

    // Function to set up the socket and handle the "orders" event
    const setupSocket = () => {
        socket.on("AdminOrders", (data) => {
            console.table(data.order);
            const newOrder = data.order
            setOrder((prev) => {
                if (order && newOrder._id == order._id) {
                    return newOrder
                }
                return prev
            })
        });
    };

    useLayoutEffect(() => {
        setOrderID(orderID)
        const fetchOrder = async () => {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-orders`, {
                method: 'POST',
                headers: { user: localStorage.getItem('token'), 'content-type': 'application/json' },
                body: JSON.stringify({ orderId: orderID })
            })
            const data = await r.json()
            setOrder(data.order)
            setUser(data.user)
        }
        fetchOrder()
    }, [])

    return (
        <div>
            {order && <OrderComponent order={order} user={user} />}
        </div>
    )
}

const Item = ({ item, key }) => (
    <div className="cart-item" style={{ marginTop: '3px' }} key={key}>
        <img src={item.image.startsWith('/') == '/' || item.image.startsWith("http") ? item.image : '/' + item.image} alt={item.name} />
        <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p>{item.price.toFixed(2) + ' x ' + item.quantity} {'='} ₹{(item.price * item.quantity).toFixed(2)}</p>
        </div>

    </div>
);


const OrderComponent = ({ order, user }) => {
    const [orderStatus, setOrderStatus] = useState(order.orderStatus)
    const updateStatus = async (e) => {
        setOrderStatus(e.target.value)
        const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/update-order-status`, {
            method: 'POST',
            headers: { user: localStorage.getItem('token'), 'content-type': 'application/json' },
            body: JSON.stringify({ orderId: order._id, newStatus: e.target.value })
        })
        const data = await r.json()

    }
    return (
        <div className='order-container'>
            <h3 className='order-id' >Order ID: {order._id}</h3>
            <h4 className='order-name'><strong>{order.items.map(item => item.name).join(', ')}</strong></h4>
            <p><strong>Customer Name:</strong> {user.name}</p>
            <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
            <p><strong>Order Status:</strong> {orderStatus}</p>
            {order.paymentStatus === 'Paid' ?
                <div className="status-container">
                    <h4 style={{ color: 'green', marginTop: '0px' }}>Change Order Status</h4>
                    <select value={orderStatus} onChange={updateStatus} className='select-input'>
                        <option value="Placed">Order Placed</option>
                        <option value="Order Received">Order Received</option>
                        <option value="In the Kitchen">In the Kitchen</option>
                        <option value="Out for Delivery">Out for Delivery</option>
                        <option value="Delivered">Delivered</option>
                    </select>
                </div> : <></>}
            <p><strong>Subtotal:</strong> ₹{parseInt(order.subtotal)} <small> (Including Taxes)</small></p>
            <p><strong>Order Date:</strong> {new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'Asia/Kolkata' })}</p>
            <h3 style={{ color: 'green', marginTop: '10px' }}> Address <hr /></h3>
            <p>{order.address.street}, {order.address.city}, {order.address.state}, {order.address.pincode}</p>
            <h3 style={{ color: 'green', marginTop: '10px' }}>Items
                <hr /></h3>
            {order.items.map((item, index) => (
                <Item key={index} item={item} />
            ))}

        </div>
    );
};




export default AdminOrder