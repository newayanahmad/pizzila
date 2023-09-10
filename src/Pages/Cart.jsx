import React from 'react';

const CartItem = ({ item, updateQuantity }) => (
    <div className="cart-item">
        <img src={item.image} alt={item.name} />
        <div className="cart-item-info">
            <h4>{item.name}</h4>
            <p>Rs- {(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <div className="quantity-controls">
            <button onClick={() => updateQuantity(item, -1)}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item, 1)}>+</button>
        </div>
    </div>
);

const Cart = ({ cart, updateQuantity }) => {
    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

    return (
        <div className="cart">
            <h2>Your Cart</h2>
            {cart.length === 0 ? (
                <p>Your cart is empty.</p>
            ) : (
                <>
                    {cart.map((item) => (
                        <CartItem key={item.id} item={item} updateQuantity={updateQuantity} />
                    ))}
                    <hr />
                    <div className="cart-total">
                        <p>Subtotal:</p>
                        <p>Rs- {subtotal.toFixed(2)}</p>
                    </div>
                    <button className="checkout-button">Checkout</button>
                </>
            )}
        </div>
    );
};

export default Cart;
