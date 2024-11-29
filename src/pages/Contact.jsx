import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    console.log('Form submitted:', formData);
    alert('Thank you for your message! Our sales team will contact you soon.');
  };

  return (
    <>
      <div className="container-fluid bg-light">
        <div className="row bg-primary text-white py-5 mb-4">
          <div className="col text-center">
            <h1 className="display-3">Contact Sales</h1>
          </div>
        </div>
        <div className="container" style={{marginBottom: "10vh"}}>
          <div className="row">
            <div className="col-md-7 pe-5">
              <h2 className="mb-4">Accelerate Language Learning</h2>
              <p className="lead">
                Ready to transform your students' language acquisition with cutting-edge AI? Our sales team is eager to help you implement IMRS's immersive learning solutions.
              </p>
              <p>
                Connect with us today to:
                <ul className="list-unstyled">
                  <li>• Explore personalized AI language programs</li>
                  <li>• Discover adaptive learning technologies</li>
                  <li>• Get custom implementation strategies</li>
                </ul>
              </p>
              <p className="text-muted">
                Kickstart your students' language learning journey and unlock their full potential with IMRS.
              </p>
            </div>
            <div className="col-md-5">
              <div className="card shadow-lg">
                <div className="card-body p-5">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        placeholder='i.e. John Williams'
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Work Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        placeholder='i.e. johnwilliams@school.com'
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Your Message</label>
                      <textarea
                        className="form-control"
                        id="message"
                        name="message"
                        rows="4"
                        placeholder='I have a class with 14 students learning Portugese. They are ages 10-11.'
                        value={formData.message}
                        onChange={handleChange}
                        required
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Submit
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Contact;