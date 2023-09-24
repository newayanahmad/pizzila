import React, { createRef, useState, useContext } from 'react'
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx'
import { BsBagCheckFill } from 'react-icons/bs'
import { Link as L } from 'react-scroll'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import { FaUserAlt } from 'react-icons/fa'
import CartContext from '../../context/CartContext'

const Navbar = () => {
    const [navOpen, setNavOpen] = useState(false)
    const navRef = createRef()
    const [isLoggedIn, setIsLoggedIn] = useContext(AuthContext)



    const logout = () => {
        closeSidebar();
        if (confirm("Press OK' to confirm logging out, or 'Cancel' to remain logged in.")) {
            setIsLoggedIn(false);
            localStorage.removeItem('token')
        }
    }
    const closeSidebar = () => {
        navRef.current.classList.remove('open')
        navRef.current.classList.add('close')
        setNavOpen((value) => setNavOpen(!value))
    }
    const openSidebar = () => {
        navRef.current.classList.add('open')
        navRef.current.classList.remove('close')
        setNavOpen((value) => setNavOpen(!value))
    }
    return (
        <nav className='navbar'>
            <RxHamburgerMenu className='openMenu' onClick={openSidebar} />
            <Link to={"/"}>
                <div className="logo" >

                    <img src={"/logo.png"} alt="" width={50} />
                    <p>PIZZILA</p>
                </div>
            </Link>
            <ul ref={navRef}>
                <li><Link to={'/'} onClick={closeSidebar}>Home</Link></li>
                <li ><L onClick={closeSidebar} to='about' duration={200}>About</L></li>
                <li onClick={closeSidebar}><L to='#contact'>Contact Us</L></li>
                {isLoggedIn ? <li onClick={logout} >Logout</li> :
                    <li onClick={closeSidebar}><Link className='signin' to='login'>Sign In</Link></li>
                }
                <RxCross2 onClick={closeSidebar} className='cross' />
            </ul>
            <div className="nav-right" >

                {isLoggedIn ? <>
                    <Link to='cart'>
                        <BsBagCheckFill className='shoppingBag' />
                    </Link>
                    <Link to='/dashboard/profile'>
                        <FaUserAlt style={{ color: 'wheat', marginLeft: '30px', fontSize: 'larger' }} />
                    </Link>
                </> : <></>}
            </div>
        </nav>
    )
}

export default Navbar