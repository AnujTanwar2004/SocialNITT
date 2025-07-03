// src/components/footer/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

function Footer() {
    return (
        <footer className="footer-balanced">
            <div className="footer-container">
                <div className="footer-content">
                    {/* About Section */}
                    <div className="footer-section about-section">
                        <div className="logo">
                            <div className="logo-icon">
                                <span>CN</span>
                            </div>
                            <h3>CommuNITT</h3>
                        </div>
                        <p>A student-powered network connecting the NITT community. Buy, sell, exchange services, and build lasting connections.</p>
                        
                        <div className="social-links">
                            <a href="https://github.com/AnujTanwar2004/SocialNITT" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                                <i className="fab fa-github"></i>
                            </a>
                            
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className="footer-section">
                        <h4>Quick Links</h4>
                        <ul>
                            <li><Link to="/"><i className="fas fa-home"></i> Home</Link></li>
                            <li><Link to="/products"><i className="fas fa-shopping-bag"></i> Products</Link></li>
                            <li><Link to="/services"><i className="fas fa-tools"></i> Services</Link></li>
                            <li><Link to="/foods"><i className="fas fa-utensils"></i> Food</Link></li>
                            <li><Link to="/profile"><i className="fas fa-user"></i> Profile</Link></li>
                        </ul>
                    </div>

                    {/* Platform Features */}
                    <div className="footer-section">
                        <h4>Features</h4>
                        <div className="features-grid">
                            <div className="feature-item">
                                 <li><Link to="/aboutus">About Us</Link></li>
                            </div>
                            <div className="feature-item">
                                  <li><Link to="/contact">Contact Us</Link></li>
                            </div>
                            <div className="feature-item">
                                <li><Link to="/contact">Help Center</Link></li>
                            </div>
                            <div className="feature-item">
                                <i className="fas fa-users"></i>
                                <span>CommuNITT</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact & Support */}
                    <div className="footer-section">
                        <h4>Support</h4>
                        <div className="contact-list">
                            <div className="contact-item">
                                <i className="fas fa-envelope"></i>
                                <span>support@CommuNITT.com</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-map-marker-alt"></i>
                                <span>NIT Trichy, Tamil Nadu</span>
                            </div>
                            <div className="contact-item">
                                <i className="fas fa-robot"></i>
                                <span>24/7 AI Assistant</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Footer */}
                <div className="footer-bottom">
                    <div className="footer-bottom-content">
                        <p>&copy; 2025 CommuNITT. Licensed property of OSOC | All rights reserved.</p>
                        <div className="footer-bottom-links">
                            <Link to="/privacy">Privacy Policy</Link>
                            <Link to="/terms">Terms of Service</Link>
                        
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;