import React, { useContext, useEffect, useState } from 'react';
import '../components/css/UserDashboard.css';
import { GiFullPizza } from 'react-icons/gi'
import { FaUserAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext'
import moment from 'moment';
function Profile() {
    const [user, setUser] = useState({})
    useEffect(() => {
        document.title = 'Profile | Pizzila'
        const fetchUser = async (req, res) => {
            const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/get-user`, {
                method: 'POST',
                headers: { user: localStorage.getItem('token') }
            })
            const data = await r.json()
            setUser(data)
        }
        fetchUser()
    }, [])

    return (
        <div className='profile'>
            <h2 style={{ marginLeft: "10px" }}>Profile</h2>
            <br />
            <div className='profile-details'>
                <label htmlFor="name">Name</label>
                <input type="text" value={user.name} readOnly />
                <label htmlFor="email">Email</label>
                <input type="email" name="email" id="email" value={user.email} readOnly />
                <span style={{ margin: 'auto', marginLeft: '10px' }}>Joined {moment(user.date).fromNow()}</span>
            </div>

        </div>
    );
}

function UserProfile() {

    const navigation = useNavigate()
    const [isLoggedIn] = useContext(AuthContext)

    useEffect(() => {
        const checkUser = async () => {
            let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verifyuser`, {
                method: 'POST',
                headers: { token: localStorage.getItem('token') }
            })
            let result = await res.json()
            if (!result.userValid) {
                navigation('../login')
            }
        }
        checkUser()
    }, [isLoggedIn])

    return (<>
        <div className="app">
            <div className="sidebar">
                <button className="sidebar-button" ><FaUserAlt className='icon' /><p>Profile</p></button>
                <button className="sidebar-button" onClick={() => navigation('../dashboard/orders')}><GiFullPizza className='icon' /><p>Orders</p></button>
            </div>
            <div className="content"><Profile />
            </div>
        </div>
    </>
    );
}

export default UserProfile;
