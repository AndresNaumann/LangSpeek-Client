import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';

const About = () => {
  return (
    <>
    <div className="container-fluid bg-light">
      <div className="row bg-primary text-white py-5 mb-4">
        <div className="col text-center">
          <h1 className="display-3">About IMRS</h1>
        </div>
      </div>
      <div className="container" style={{marginBottom: "100px"}}>
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4">Revolutionizing Language Learning with AI</h2>
                <p className="card-text lead">
                  IMRS is a cutting-edge educational technology company dedicated to transforming language learning through advanced artificial intelligence. Our innovative platform creates immersive, personalized language experiences that adapt to each student's unique learning style and pace.
                </p>
                <div className="my-4">
                  <h3>Our Core Mission</h3>
                  <p>
                    We believe that true language mastery comes from complete immersion. By leveraging state-of-the-art AI technologies, IMRS breaks down traditional barriers in language education, providing students with:
                  </p>
                  <ul className="list-unstyled">
                    <li className="mb-2">• Real-time conversational AI tutors</li>
                    <li className="mb-2">• Adaptive learning pathways</li>
                    <li className="mb-2">• Contextual language environments</li>
                    <li className="mb-2">• Personalized feedback and progress tracking</li>
                  </ul>
                </div>
                <p>
                  Our team of linguists, AI researchers, and educational experts are committed to making language learning more accessible, engaging, and effective for learners worldwide.
                </p>
                <div className="text-center mt-4">
                  <p className="font-italic">
                    "Breaking language barriers, one conversation at a time."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default About;