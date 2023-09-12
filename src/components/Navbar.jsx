import React, { createRef, useLayoutEffect, useState } from 'react'
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx'
import { BsBagCheckFill } from 'react-icons/bs'
import { Link as L } from 'react-scroll'
import { Link } from 'react-router-dom'


const Navbar = () => {
    const [navOpen, setNavOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navRef = createRef()

    useLayoutEffect(() => {
        const checkUser = async () => {
            let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verifyuser`, {
                method: 'POST',
                headers: {
                    token: localStorage.getItem('token')
                }
            })
            let result = await res.json()
            if (result.userValid) {
                setIsLoggedIn(true)
            }
        }
        checkUser()
    }, [])
    const closeSidebar = () => {
        console.log('clicked');

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
            <div className="logo" >

                <img src={"logo.png"} alt="" width={50} />
                <p>PIZZILA</p>
            </div>
            <ul ref={navRef}>
                <li><L onClick={closeSidebar} to='home' smooth={true} duration={200}>Home</L></li>
                <li ><L onClick={closeSidebar} to='about' smooth={true} duration={200}>About</L></li>
                <li onClick={closeSidebar}><L to='#contact'>Contact Us</L></li>
                {isLoggedIn ? <li onClick={() => { closeSidebar(); setIsLoggedIn(false); localStorage.removeItem('token') }} >Logout</li> :
                    <li onClick={closeSidebar}><Link className='signin' to='register'>Sign In</Link></li>
                }
                <RxCross2 onClick={closeSidebar} className='cross' />
            </ul>
            <Link to='cart'>

                <BsBagCheckFill className='shoppingBag' />
            </Link>
        </nav>
    )
}

export default Navbar