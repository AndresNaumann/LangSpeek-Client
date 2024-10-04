import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const About = () => {
  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title text-center">About Us</h1>
              <p className="card-text">
                Welcome to our website! We are dedicated to providing the best
                service possible. Our team is passionate about what we do and we
                strive to exceed your expectations.
              </p>
              <p className="card-text">
                Our mission is to deliver high-quality products that bring value
                to our customers. We believe in innovation, integrity, and
                customer satisfaction.
              </p>
              <p className="card-text">
                Thank you for visiting our site. We hope you find what you're
                looking for and enjoy your experience with us.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
