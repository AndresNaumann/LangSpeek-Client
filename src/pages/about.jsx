import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';

const About = () => {
  return (
    <>
      <div className="container-fluid bg-light">
        <div className="row bg-primary text-white py-5 mb-4">
          <div className="col text-center">
            <h1 className="display-3">About BOMbot</h1>
          </div>
        </div>
        <div className="container" style={{ marginBottom: "100px" }}>
          <div className="row">
            <div className="col-md-10 offset-md-1">
              <div className="card shadow-lg">
                <div className="card-body p-5">
                  <h2 className="card-title text-center mb-4">Exploring the Book of Mormon with AI</h2>
                  <p className="card-text lead">
                    BOMbot is an interactive AI-powered assistant designed to help users ask questions and explore the teachings of the Book of Mormon. Whether you're a lifelong student or new to the scriptures, our chatbot offers thoughtful, context-aware responses grounded in the text.
                  </p>
                  <div className="my-4">
                    <h3>Our Purpose</h3>
                    <p>
                      We believe that scripture study should be engaging, accessible, and guided by curiosity. BOMbot was built to support deeper learning and reflection by providing:
                    </p>
                    <ul className="list-unstyled">
                      <li className="mb-2">• Instant answers to doctrinal and historical questions</li>
                      <li className="mb-2">• Explanations of key themes, characters, and verses</li>
                      <li className="mb-2">• Personalized study assistance based on user interests</li>
                      <li className="mb-2">• A respectful and reverent approach to sacred texts</li>
                    </ul>
                  </div>
                  <p>
                    Our team combines faith, scholarship, and advanced AI to help individuals engage with the Book of Mormon in a meaningful and dynamic way. We aim to foster a love of scripture and invite users to draw closer to the principles taught within.
                  </p>
                  <div className="text-center mt-4">
                    <p className="font-italic">
                      "Ask, and it shall be given you; seek, and ye shall find." — Matthew 7:7
                    </p>
                  </div>
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

export default About;
