import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Facebook, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Heikkuri Family History Website</h5>
            <p>Learn all about the Heikkuris and what it was like to live in Finland in the early 1900s.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/about" className="text-white">About</a></li>
            </ul>
          </div>
          <div className="col-md-4">
      
            <p className="mt-3">© 2024 Andrew Naumann. All Rights Reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;