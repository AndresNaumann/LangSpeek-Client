import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>BOMbot</h5>
            <p>Find answers to your most pressing questions about the book of mormon</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/about" className="text-white">About</a></li>
              <li><a href="/contact" className="text-white">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Connect With Us</h5>
            <div className="d-flex">
              <a href="#" className="text-white me-3"><Facebook /></a>
              <a href="#" className="text-white me-3"><Twitter /></a>
              <a href="#" className="text-white me-3"><Linkedin /></a>

            </div>
            <p className="mt-3">© 2024 BOMbot. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;