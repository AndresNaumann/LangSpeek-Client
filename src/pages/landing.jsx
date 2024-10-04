import React from "react";

const Landing = () => {
  return (
    <div className="container-fluid p-0">
      <header className="bg-dark text-white text-center py-5">
        <h1 className="display-4">Become IMRSD</h1>
        <p className="lead">Your gateway to mastering new languages</p>
        <a href="#features" className="btn btn-primary btn-lg mt-3">
          Learn More
        </a>
      </header>
      <section id="features" className="py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Feature One</h5>
                  <p className="card-text">Description of feature one.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Feature Two</h5>
                  <p className="card-text">Description of feature two.</p>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card mb-4">
                <div className="card-body text-center">
                  <h5 className="card-title">Feature Three</h5>
                  <p className="card-text">Description of feature three.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="bg-dark text-white text-center py-3">
        <p className="mb-0">&copy; 2023 LangSpeek. All rights reserved.</p>
      </footer>
    </div>
  );
};
export default Landing;
