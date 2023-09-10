import React, { createRef, useState } from 'react'
import { RxCross2, RxHamburgerMenu } from 'react-icons/rx'
import { BsBagCheckFill } from 'react-icons/bs'
import { Link, UNSAFE_NavigationContext } from 'react-router-dom'


const Navbar = () => {

    const [navOpen, setNavOpen] = useState(false)
    const navRef = createRef()
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
                <li>Home</li>
                <li>About</li>
                <li>Contact Us</li>
                <li>SIGN IN</li>
                <RxCross2 onClick={closeSidebar} className='cross' />
            </ul>
            <Link to='cart'>

                <BsBagCheckFill className='shoppingBag' />
            </Link>
        </nav>
    )
}

export default Navbar