import React, { useState, useLayoutEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './css/RegistrationForm.css'
import OTPVerification from './OTPVerification'
import AuthContext from '../../context/AuthContext'


const RegistrationForm = () => {

    const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext)
    const navigation = useNavigate()
    useLayoutEffect(() => {
        document.title = 'Register | Pizzila'
        if (isLoggedIn) {
            navigation("/")
        }
    }, [])

    const [name, setName] = useState('')
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState("")
    const [error, setError] = useState("")
    const [isRegistered, setIsRegistered] = useState(false)

    const back = () => {
        setIsRegistered(false)
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        if (name === "" || email === "" || password === "" || confirmPassword === "") {
            setError("All fields must be filled out");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please enter a valid email")
            return false;
        }

        if (password.length < 8 || !/\d/.test(password) || !/[a-zA-Z]/.test(password)) {
            setError("Password needs 8+ characters with digits and letters.");
            return false;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return false;
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/register`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: name,
                password: password,
                email: email
            })
        })
        const data = await res.json()
        if (data.success == false) {
            setError(data.message)
        }
        else {
            setIsLoggedIn(true)
            setIsRegistered(true)
        }
    }
    const handleChange = (e) => {
        setError("")
        if (e.target.name == 'name') setName(e.target.value)
        else if (e.target.name == 'password') setPassword(e.target.value)
        else if (e.target.name == 'confirm-password') setConfirmPassword(e.target.value)
        else if (e.target.name == 'email') setEmail(e.target.value)
    }
    return (<>
        {isRegistered ? <OTPVerification email={email} back={back} /> :
            <div className="registration-container">
                <div className="register-form">
                    <form action="" onSubmit={handleSubmit}>
                        <p>Register</p>
                        <input type="text" value={name} onChange={handleChange} name="name" id="name" placeholder='Name' />
                        <input type="email" value={email} onChange={handleChange} name="email" id="email" placeholder='Email' />
                        <input type="password" value={password} onChange={handleChange} id='password' name='password' placeholder='Password' />
                        <input type="password" value={confirmPassword} onChange={handleChange} name="confirm-password" id="confirm-password" placeholder='Confirm Password' />
                        <span className='error'>{error}</span>
                        <input type="submit" value="Create Account" />
                        <span>Already Registred? <Link to="../login">Login</Link></span>
                    </form>
                </div>
            </div>}
    </>
    )
}

export default RegistrationForm