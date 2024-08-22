import React from 'react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
          <div className="footer-left">
            <a href="#about" className="footer-link">About Us</a>
            <a href="#contact" className="footer-link">Contact</a>
            <a href="#feedback" className="footer-link">Feedback</a>
          </div>
          <div className="footer-right">
            <span className="copyright">© 2024</span>
            <span className="company-name">PaletteSync</span>
            <span className="rights">All Rights Reserved</span>
          </div>
        </footer>
      );
}