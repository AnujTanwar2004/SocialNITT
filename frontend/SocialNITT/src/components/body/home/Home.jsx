import React from 'react'
import FaqsCard from './FaqsCard'

import heroImage from './hero.png';
function Home() {

    

    return (
        <>
            <div className="hero-dark-container">
                <section className="hero-dark">
                    <div className="hero-details">
                    <h1>
                        Empowering NITT Students <br></br>
                            <span>to Help Each Other And Build a Better Campus Life.</span>
                        </h1>
                        <p>
                        This is more than a platform — it’s a student-powered network. Buy or sell what you need, offer your skills, raise your voice for campus improvements, or simply lend a hand. Every post, every service, and every complaint makes NITT stronger, together.

                        </p>
                        <div className="hero-btns">
                            <a href="/login" className="btn-primary">
                                Get started
                            </a>
                        </div>
                    </div>
                    <div className="hero-img">
                        <img src= {heroImage} alt=""/>
                    </div>
                </section>
            </div>
            <FaqsCard />
            <footer>
                © Created by mentees of Janet Ma'am
            </footer>
        </>
    )
}

export default Home
