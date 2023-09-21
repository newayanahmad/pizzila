import React, { useState } from 'react'
import './css/RegistrationForm.css'
import './css/AdminLogin.css'
import { Link, useNavigate } from 'react-router-dom'

const AdminLoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isVerified, setIsVerified] = useState(true)

    const navigation = useNavigate()

    const back = () => {
        setIsVerified(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (email === "" || password === "") {
            setError("All fields must be filled out");
            return false;
        }
        if (!/^\S+@\S+\.\S+$/.test(email)) {
            setError("Please enter a valid email")
            return false;
        }
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({ email: email, password: password, isAdmin: true })
        })
        let result = await res.json()
        if (result.success) {
            localStorage.setItem('token', result.token)
            setIsVerified(true)
            navigation("../../")
        }
        else {
            setError(result.message)
        }
    }
    const handleChange = (e) => {
        setError("")
        if (e.target.name == "email") setEmail(e.target.value)
        else if (e.target.name == "password") setPassword(e.target.value)
    }
    return (<>
        <div className="main_box">
            < div className="register-form" >
                <form action="" onSubmit={handleSubmit}>
                    <p>Admin Login</p>
                    <input type="email" value={email} onChange={handleChange} name="email" id="email" placeholder='Email' />
                    <input type="password" value={password} onChange={handleChange} id='password' name='password' placeholder='Password' />
                    <span className='error'>{error}</span>
                    <input type="submit" value="Login" />
                </form>
            </div >
        </div >
    </>
    )
}

export default AdminLoginPage
