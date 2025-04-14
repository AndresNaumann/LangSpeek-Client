import React from "react";
import Footer from "../components/Footer"

const Landing = () => {
  return (
    <>
      <div className="container-fluid p-0">
        <header
          className="relative text-white text-center py-20 bg-cover bg-center"
          style={{
            backgroundImage: "url('/christ.png')",
            brightness: "0.2",
          }}
        >
          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-60"></div>

          {/* Content */}
          <div className="relative z-10" >
            <h1 style={{ paddingTop: "5vh" }}>BOMbot</h1>
            {/* <h1 className="display-4">Become IMRSD</h1> */}
            <p className="lead">Ask your most pressing questions about the Book Of Mormon</p>
            <a href="https://www.churchofjesuschrist.org/comeuntochrist/believe/book-of-mormon" target="_blank" className="btn btn-primary btn-lg mt-3" style={{ marginBottom: "4vh" }}>
              Learn More
            </a>
          </div>
        </header>

        <section id="features" className="py-5" style={{ marginBottom: "0vh" }}>
          <div className="container">
            <div className="row">
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body text-center">
                    <h5 className="card-title">Ask Questions</h5>
                    <p className="card-text"></p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body text-center">
                    <h5 className="card-title">Receive Answers</h5>
                    <p className="card-text"></p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card mb-4">
                  <div className="card-body text-center">
                    <h5 className="card-title">Grow your faith</h5>
                    <p className="card-text"> </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-5" style={{ marginBottom: "20vh" }}>
          <div className="container">
            <h2 className="text-center mb-4">About BOMbot</h2>
            <p className="text-center">
              BOMbot is a revolutionary tool designed to help you find answers to your most pressing questions about the Book of Mormon. With its advanced AI capabilities, BOMbot can provide you with accurate and insightful responses, making your study of the scriptures more enriching and meaningful.
            </p>
            <p className="text-center">
              Whether you're a lifelong member of the Church or just starting your journey, BOMbot is here to assist you in deepening your understanding of the gospel and strengthening your faith.
            </p>
            <a href="/chat" className="btn btn-primary btn-lg mt-3" style={{ marginBottom: "4vh" }}>
              Start Chatting
            </a>
          </div>
        </section>
        {/* <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">&copy; 2023 LangSpeek. All rights reserved.</p>
      </footer> */}
      </div>
      <Footer />
    </>
  );
};
export default Landing;
