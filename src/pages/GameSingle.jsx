import React from 'react'
import NavBar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../components/Hero'
import Contact from '../components/Contact'
import GameDetailPage from './GameDesc'

const GameSingle = () => {
  return (
        <div className="bg-black">
            <NavBar />
            <section className="bg-black mb-10">
                <GameDetailPage />
            </section>

            {/* <Contact /> */}
            <Footer />
        </div>
    )
}

export default GameSingle
