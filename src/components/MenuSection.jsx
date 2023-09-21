import React, { useState, useEffect, useContext } from 'react';
import './css/MenuSection.css'; // Import the CSS file
import Modal from 'react-modal'; // Import the react-modal library
import AuthContext from '../../context/AuthContext';
import CartContext from '../../context/CartContext'
import { useNavigate } from 'react-router-dom'

const MenuSection = () => {
    const [pizzas, setPizzas] = useState([]);
    const [cartSubtotal, setCartSubtotal] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentPizza, setCurrentPizza] = useState(null);
    const [cart, setCart] = useContext(CartContext)// To store cart items
    const [showCart, setShowCart] = useState(false);
    const navigation = useNavigate()
    // this effect runs whenever `cart` changes


    const updateCart = async (pizza, quantity) => {
        if (!isLoggedIn) {
            navigation("login")
        }
        const existingPizza = cart.find((item) => item._id === pizza._id);

        if (existingPizza) {
            const updatedCartItems = cart.map((item) =>
                item._id === pizza._id
                    ? quantity === -1 && item.quantity <= 1
                        ? null
                        : { ...item, quantity: item.quantity + quantity }
                    : item
            )
                .filter(Boolean);
            await setCart(updatedCartItems);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/add-to-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token')
                },
                body: JSON.stringify({ cart: updatedCartItems })
            });
        } else {
            await setCart([...cart, { ...pizza, quantity: 1 }]);
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/add-to-cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    token: localStorage.getItem('token')
                },
                body: JSON.stringify({ cart: [...cart, { ...pizza, quantity: 1 }] })
            });
        }
        console.log('new cart', cart);
        setShowCart(true);
    };

    useEffect(() => {
        const fetchPizzas = async () => {
            const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/getpizzas`, { method: 'GET' });
            const p = await data.json();
            setPizzas(p);
        };
        fetchPizzas();
    }, []);

    useEffect(() => {
        const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
        setCartSubtotal(subtotal);
        if (subtotal) setShowCart(true)
    }, [cart])

    const openModal = (pizza) => {
        setCurrentPizza(pizza);
        setModalIsOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
    };

    const closeModal = () => {
        setModalIsOpen(false);
        document.body.style.overflow = 'auto'; // Allow background scrolling when the modal is closed
    };

    return (
        <div className="menu">
            <div className="menu-container">
                <h2>Our Pizzas</h2>
                <div className="pizzas">
                    {pizzas.map((pizza) => (
                        <div key={pizza._id} className="pizza">
                            <img src={pizza.image} alt={pizza.name} />
                            <div className="">
                                <div className="pizza-info">
                                    <h4>{pizza.name}</h4>
                                    <p>₹{pizza.price.toFixed(2)}</p>
                                    <p style={{ color: 'gray', fontSize: 'small' }}>
                                        {pizza.description.slice(0, 40)}...
                                        <span onClick={() => openModal(pizza)} className="read-more">Read More</span>
                                    </p>
                                </div>
                                <div className="quantity-controls">
                                    {cart.some((item) => item._id === pizza._id) ? (
                                        <div className="quantity-controls">
                                            <button onClick={() => updateCart(pizza, -1)}>-</button>
                                            <span>{cart.find((item) => item._id === pizza._id)?.quantity || 1}</span>
                                            <button onClick={() => updateCart(pizza, 1)}>+</button>
                                        </div>
                                    ) : (
                                        <button className="add-button" style={{ whiteSpace: 'nowrap' }} onClick={() => updateCart(pizza)}>
                                            Add +
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                    ))}
                    {cartSubtotal != 0 &&
                        <div className="cart-bar" style={{ display: showCart ? 'flex' : 'none' }}>
                            <div className="cart-info">
                                <p>Subtotal: ₹{cartSubtotal.toFixed(2)}</p>
                                <button className="proceed-to-cart-button" onClick={() => navigation('cart')}>Proceed to Cart</button>
                            </div>
                        </div>}

                </div>
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

        </div>
    );
};

export default MenuSection;
