import React, { useContext, useEffect, useState } from 'react';
import '../components/css/UserDashboard.css';
import { GiFullPizza } from 'react-icons/gi'
import { FaBoxOpen, FaPizzaSlice } from 'react-icons/fa'
import { useNavigate, useSearchParams } from 'react-router-dom';
import SocketContext from '../../context/SocketContext';
import Modal from 'react-modal'
import AuthContext from '../../context/AuthContext';

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
            if (!localStorage.getItem('token')) navigation('../admin/login')
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


const PizzaList = () => {
    const navigation = useNavigate()
    const [pizzas, setPizzas] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPizza, setCurrentPizza] = useState(null);
    useEffect(() => {
        document.title = 'Pizza | Pizzila';
        const fetchPizzas = async () => {
            const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getpizzas`, { method: 'GET' });
            const p = await data.json();
            setPizzas(p);
        };
        fetchPizzas();
    }, []);
    const openModal = (pizza) => {
        setCurrentPizza(pizza);
        setModalIsOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setModalIsOpen(false);
        document.body.style.overflow = 'auto'; // Allow background scrolling when the modal is closed
    };

    const removePizza = async (pizza) => {
        const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/remove-pizza`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                token: localStorage.getItem('token')
            },
            body: JSON.stringify({ pizzaID: pizza._id })
        });
        const data = await r.json()
        if (data.success) {
            setPizzas(prev => prev.filter(p => p._id !== pizza._id))
        }
        else {
            alert("Failed to remove pizza")
        }
    }

    return (<><h2>Admin Dashboard</h2> <hr />
        <h3 >Pizza</h3>
        <center className='center' onClick={() => navigation("create-pizza")} style={{ position: 'absolute', top: '75vh', zIndex: '2' }}><button className='add-pizza' >Add Pizza +</button></center>
        <div className="pizzas orders">
            {pizzas && pizzas.map((pizza) => (
                <div key={pizza._id} className="pizza" style={{ marginTop: '0' }}>
                    <img src={pizza.image.startsWith('/') == '/' || pizza.image.startsWith("http") ? pizza.image : '/' + pizza.image} alt={pizza.name} />
                    <div className="">
                        <div className="pizza-info">
                            <h4>{pizza.name}</h4>
                            <p>₹{pizza.price.toFixed(2)}</p>
                            <p style={{ color: 'gray', fontSize: 'small' }}>
                                {pizza.description.slice(0, 40)}...
                                <span onClick={() => openModal(pizza)} className="read-more" style={{ color: '#000' }}>Read More</span>
                            </p>
                        </div>
                        <button className="add-button" style={{ whiteSpace: 'nowrap', fontSize: 'small', backgroundColor: 'red', color: 'white' }} onClick={() => removePizza(pizza)} >
                            Remove
                        </button>

                    </div>
                </div>

            ))}
            <br />
            <br />
            <br />
        </div>
        <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            contentLabel="Pizza Details"
            style={{
                overlay: {
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Semi-transparent background
                },
                content: {
                    maxHeight: 'max-content',
                    maxWidth: '600px',
                    // width: '700px',
                    margin: 'auto',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    padding: '10px',
                    fontSize: '1rem', // Base font size
                }
            }}
            ariaHideApp={false} // Disable ariaHideApp
        >
            {currentPizza && (
                <>
                    <button onClick={closeModal} style={{ position: 'absolute', borderRadius: '10px', right: 10, top: 10 }}>X</button>
                    <h4 style={{ fontSize: '1.2rem' }}>{currentPizza.name}</h4> {/* Larger font size for the title */}
                    <p style={{ fontSize: '1rem', fontWeight: 'bold' }}>₹{currentPizza.price.toFixed(2)}</p> {/* Larger font size and bold for the price */}
                    <p>{currentPizza.description}</p>
                    <p>Category: {currentPizza.category}</p>
                    <div>
                        <h4 style={{ textDecoration: 'underline' }}>Ingredients:</h4> {/* Underline for the section title */}
                        {currentPizza.ingredients.base.length > 0 && <p>Base: {currentPizza.ingredients.base.join(', ')}</p>}
                        {currentPizza.ingredients.sauce.length > 0 && <p>Sauce: {currentPizza.ingredients.sauce.join(', ')}</p>}
                        {currentPizza.ingredients.cheese.length > 0 && <p>Cheese: {currentPizza.ingredients.cheese.join(', ')}</p>}
                        {currentPizza.ingredients.veggies.length > 0 && <p>Veggies: {currentPizza.ingredients.veggies.join(', ')}</p>}
                    </div>
                </>
            )}
        </Modal>
    </>

    )
}
P
function AdminDashboard() {
    const [queryParameters] = useSearchParams()
    let section = queryParameters.get('section')
    const navigation = useNavigate()
    const [isLoggedIn] = useContext(AuthContext)

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

    return (<>
        <div className="app">
            <div className="sidebar">
                <button className="sidebar-button" onClick={() => navigation('../admin/dashboard')}><FaPizzaSlice className='icon' /><p>Orders</p></button>
                <button className="sidebar-button" onClick={() => navigation('../admin/dashboard?section=inventory')}><FaBoxOpen className='icon' /><p>Inventory</p></button>
                <button className="sidebar-button" style={{ whiteSpace: 'normal' }} onClick={() => navigation('../admin/dashboard?section=pizza')}><GiFullPizza className='icon' /><p style={{ whiteSpace: 'nowrap' }}>Pizza</p></button>
            </div>
            <div className="content">
                {section === 'inventory' ? <Inventory /> : (section === 'pizza' ? <div style={{ overflow: 'hidden' }}><PizzaList /></div> : <Orders />)}
            </div>
        </div>
    </>
    );
}

export default AdminDashboard;
