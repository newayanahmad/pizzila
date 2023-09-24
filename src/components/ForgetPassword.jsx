import React, { useState } from 'react'
import './css/RegistrationForm.css'
import OTPVerification from "./OTPVerification"
import { Link, useNavigate } from 'react-router-dom'

const ForgetPassword = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [OTP, setOTP] = useState("")
    const [sentOTP, setSentOTP] = useState(false)
    const [verified, setVerified] = useState(false)
    const [passHidden, setPassHidden] = useState(false)
    const [message, setMessage] = useState("Please enter your email")
    const [passChanged, setPassChanged] = useState(false)


    document.title = 'Reeset Password | Pizzila'
    const navigation = useNavigate()
    const resendOTP = async () => {
        let result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sendotp`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ email: email })
        })
        let data = await result.json()
        if (data.success) {
            setSentOTP(true)
            setMessage("New OTP has been sent to your email")
            return;
        }
        setError(data.message)
        return;

    }
    const back = () => {
        setVerified(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        // if (email === "" || password === "") {
        //     setError("All fields must be filled out");
        //     return false;
        // }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please enter a valid email")
            return false;
        }
        if (!sentOTP && !verified) {
            let result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/sendotp`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({ email: email })
            })
            let data = await result.json()
            if (data.success) {
                setSentOTP(true)
                setMessage(data.message)
                return;
            }
            setError(data.message)
            return;

        }
        if (sentOTP && !verified) {
            let result = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verifyotp`, {
                method: 'POST',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    email: email,
                    otp: OTP
                })
            })
            let data = await result.json()
            if (data.success) {
                setMessage("Create new password")
                setSentOTP(false)
                setVerified(true)
                return;
            }
            setError(data.message)
            return;
        }
        if (password != confirmPassword) setError("Confirm password does not match")
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password })
        })
        let result = await res.json()
        if (result.success) {
            setMessage(result.message)
            setPassHidden(true)
            setPassChanged(true)

            // navigation("../login")
        }
        else {
            setError(result.message)
        }
    }
    const handleChange = (e) => {
        setError("")
        if (e.target.name == "email") setEmail(e.target.value)
        else if (e.target.name == "password") setPassword(e.target.value)
        else if (e.target.name == "confirm-password") setConfirmPassword(e.target.value)
        else if (e.target.name == "otp") setOTP(e.target.value)
    }
    return (<>
        <div className="registration-container">
            < div className="register-form" >
                <form action="" onSubmit={handleSubmit}>
                    <p>Reset Password</p>
                    <span className='message'>{message}</span>
                    {verified ? <></> : <>
                        <input type="email" value={email} onChange={handleChange} name="email" id="email" placeholder='Email' />
                    </>}
                    {sentOTP || verified ? <></> : <input type="submit" value="Send OTP" />}
                    {sentOTP && !verified ?
                        <><input type="number" value={OTP} onChange={handleChange} required id='otp' name='otp' placeholder='Enter OTP' />
                            <span className='resend' onClick={resendOTP}>Resend OTP</span>
                            <input type="submit" value="Verify Email" /></> : <></>}
                    {verified && !passHidden ? <>
                        <input type="password" value={password} onChange={handleChange} id='password' name='password' placeholder='New Password' />
                        <input type="password" value={confirmPassword} onChange={handleChange} id='confirm-password' name='confirm-password' placeholder='Confirm Password' />
                        <input type="submit" value="Reset Password" /> </> : <></>}
                    {passChanged ?
                        <button onClick={() => navigation("../login")}>Login</button>
                        : <></>}
                    {passChanged ? <></> : <>
                        <span className='error'>{error}</span>
                        <span><Link to="../login">Back to login</Link></span>
                    </>
                    }
                </form>
            </div >
        </div >

    </>
    )
}

export default ForgetPassword