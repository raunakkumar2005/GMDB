import React from 'react'
import NavBar from '../components/Navbar'
import Contact from '../components/Contact'
import Footer from '../components/Footer'
import { AnimeDetailPage } from './descPage'

const AnimeDesc = () => {
  return (
        <div>
            <NavBar />
            
            <section >
                <AnimeDetailPage />
            </section>

            {/* <Contact/> */}
            <Footer />
        </div>
    )
}

export default AnimeDesc
