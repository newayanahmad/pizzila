import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BiArrowBack } from "react-icons/bi"

import './css/RegistrationForm.css'
const OTPVerification = ({ email, back }) => {
    const [OTP, setOTP] = useState('')
    const [error, setError] = useState("")

    const navigation = useNavigate()
    const handleChange = (e) => {
        if (e.target.name == 'otp') setOTP(e.target.value)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (OTP.length != 6) {
            setError("Invalid OTP!")
            reutrn;
        }
        let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verifyemail`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                otp: OTP
            })
        })
        let result = await res.json();
        if (result.success) {
            localStorage.setItem('token', result.token);
            navigation('/')
            return;
        }
        setError(result.message)
    }
    return (
        <div className="registration-container">
            <div className="register-form">
                <form action="" onSubmit={handleSubmit} >
                    <div>
                        <BiArrowBack onClick={back} className='backbutton' />
                        <p>Verify Email</p>
                    </div>
                    <input type="number" value={OTP} onChange={handleChange} name="otp" id="otp" placeholder='Enter OTP' />
                    <span className='error'>{error}</span>
                    <input type="submit" value="Verify Email" />
                </form>
            </div>
        </div>
    )
}

export default OTPVerification