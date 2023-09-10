import React from 'react'
import Navbar from '../components/Navbar'
import HeroSection from '../components/HeroSection'
import AboutSection from '../components/AboutSection'
import MenuSection from '../components/MenuSection'
import Reviews from '../components/Reviews'

const HomePage = () => {
    return (
        <>
            <HeroSection />
            <AboutSection />
            <MenuSection />
            <Reviews />

        </>
    )
}

export default HomePage