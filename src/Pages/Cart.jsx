import React, { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import AuthContext from '../../context/AuthContext';
import SubtotalContext from '../../context/SubtotalContext';

const CartItem = ({ item, updateQuantity }) => (
    <div className="cart-item">
        <img src={item.image} alt={item.name} />
        <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p>{item.price.toFixed(2) + ' x ' + item.quantity} {'='} ₹{(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div className="quantity-controls">
            <button onClick={() => updateQuantity(item, -1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item, 1)}>+</button>
        </div>
    </div>
);

const Cart = () => {
    const navigation = useNavigate()
    const [cart, setCart] = useContext(CartContext)
    const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext)
    const [subtotal, setSubtotal] = useContext(SubtotalContext)
    const [total, setTotal] = useState(0)

    useLayoutEffect(() => {
        document.title = 'Cart | Pizzila'
        const fetchCartItems = async () => {
            const d = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-cart-items`, {
                method: 'POST',
                headers: { user: localStorage.getItem('token') }
            })
            let r = await d.json()
            if (r.success) {
                setCart(r.cartItems)
                let a = r.cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
                console.log(a);
                setTotal(a)
                if (a >= 500) {
                    setSubtotal(a + a * 0.08)
                }
                else {
                    setSubtotal(a + a * 0.08 + 49)
                }
            }
        }
        fetchCartItems()
    }, [])


    const updateQuantity = async (pizza, quantity) => {
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
            setCart(updatedCartItems);
            let a = updatedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
            setTotal(a)
            if (a >= 500) {
                setSubtotal(a + a * 0.08)
            }
            else {
                setSubtotal(a + a * 0.08 + 49)
            }
            let d = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/add-to-cart`, {
                method: 'POST',
                headers: { 'content-type': 'application/json', token: localStorage.getItem('token') },
                body: JSON.stringify({ cart: updatedCartItems })
            })
        }
    }
        ;
    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem key={item._id} item={item} updateQuantity={updateQuantity} />
                    ))}
                    <hr />
                    <div className="cart-total">
                        <p>Amount:</p>
                        <p>{total.toFixed(2)}</p>
                    </div>
                    <div className="cart-total">
                        <p>Taxes:</p>
                        <p>{parseInt((total * 0.08).toFixed(2)).toFixed(2)}</p>
                    </div>
                    <div className="cart-total">
                        <p>Delivery Charges:</p>
                        <p>{total >= 500 ? "Free Delivery" : <>{49.0.toFixed(2)}</>}</p>
                    </div>
                    <div className="cart-total">
                        <h4>Total:</h4>
                        <h4>₹{parseInt(subtotal).toFixed(2)}</h4>
                    </div>
                    <hr />

                    <button className="checkout-button" onClick={() => navigation("../address")}>Checkout</button>
                </>
            )}
        </div>
    );
};

export default Cart;
