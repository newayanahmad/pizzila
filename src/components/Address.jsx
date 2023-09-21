import React, { useContext, useEffect, useState } from 'react';
import './css/RegistrationForm.css';
import SubtotalContext from '../../context/SubtotalContext';
import OrderIDContext from '../../context/OrderIDContext';
import CartContext from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';


const CheckoutForm = () => {
    const [subtotal] = useContext(SubtotalContext);
    const [orderID, setOrderID] = useContext(OrderIDContext);
    const [cart] = useContext(CartContext);
    const navigation = useNavigate();
    const [address, setAddress] = useState({
        street: '',
        city: '',
        state: '',
        pincode: ''
    });

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(address);
        console.log(cart);
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/place-order`, {
            method: 'POST',
            headers: { user: localStorage.getItem('token'), 'content-type': 'application/json' },
            body: JSON.stringify({ address, cart, subtotal })
        })
        const result = await res.json()
        if (result.success) {
            setOrderID(result.orderId)
            navigation('../payment')
        }

    }

    return (
        <div className="address-container">
            <div className="register-form">
                <form onSubmit={handleSubmit}>
                    <p>Address</p>
                    <input type="text" name='street' id='street' onChange={handleChange} placeholder='Street' value={address.street} required />
                    <input type="text" name='city' id='city' onChange={handleChange} placeholder='City' value={address.city} />
                    <input type="text" name='state' id='state' onChange={handleChange} placeholder='State' value={address.state} required />
                    <input type="number" name='pincode' id='pincode' onChange={handleChange} placeholder='Pincode' value={address.pincode} required />
                    <span className='sub'>Your total payable amount is ₹{subtotal.toFixed(0)}</span>
                    <input type="submit" value={`Confirm and Pay`} />
                </form>
            </div>
        </div>
    );
};

const Address = () => {
    return (<>
        <CheckoutForm />
    </>
    )
};

export default Address;
