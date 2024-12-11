import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../components/Footer';

const About = () => {
  return (
    <>
    <div className="container-fluid bg-white" style={{marginTop: "10vh", marginBottom: "40vh"}}>
      
      <div className="container" style={{marginBottom: "100px"}}>
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <div className="card shadow-lg">
              <div className="card-body p-5">
                <h2 className="card-title text-center mb-4">What is this website?</h2>
                <p className="card-text lead">
                This website serves as an educational platform where visitors can explore Finland's rich history in the early 1900s while also delving into personal stories about the user's ancestors. By combining historical insights with familial narratives, the site offers a unique and immersive perspective on Finnish culture, heritage, and the experiences of individuals during a transformative period in history.
                </p>
              
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