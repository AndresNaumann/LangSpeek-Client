import React from "react";
import Footer from "../components/Footer";

const Landing = () => {
  return (
    <>
      <div className="container-fluid p-0">
        <header className="bg-dark text-white text-center py-5 relative">
          {/* <img
            src="/LogoWhite.png"
            alt="Language Learning"
            style={{ height: "70px", width: "auto" }}
            className="mx-auto mb-4 h-10 w-auto"
          /> */}
          <h1 className="display-4">Welcome</h1>
          <p className="lead">
            Learn all about the Heikkuri family and what it was like to live in
            Finland in the early 1900s
          </p>
          <a href="#carousel" className="btn btn-primary btn-lg mt-3">
            Learn More
          </a>
        </header>

        <section
          id="carousel"
          className="py-5"
          style={{ marginBottom: "21vh" }}
        >
          <div className="container">
            <div
              id="photoCarousel"
              className="carousel slide"
              data-bs-ride="carousel"
            >
              <div className="carousel-inner">
                <div className="carousel-item active">
                  <img
                    src="/maria.png"
                    className="d-block w-100"
                    alt="Photo 1"
                    style={{
                      height: "400px",
                      objectFit: "contain",
                      borderRadius: "20%",
                    }}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Maria Kuure </h5>
                    <p>Wife of Johan Fredrik Heikkuri</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img
                    src="/lapsit.png"
                    className="d-block w-100"
                    alt="Photo 2"
                    style={{
                      height: "400px",
                      objectFit: "contain",
                      borderRadius: "20%",
                    }}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Johan and Maria's 10 Children </h5>
                  </div>
                </div>
                <div className="carousel-item">
                  <img
                    src="/koti.png"
                    className="d-block w-100"
                    alt="Photo 3"
                    style={{
                      height: "400px",
                      objectFit: "contain",
                      borderRadius: "20%",
                    }}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Pellonpojan Talo</h5>
                    <p>Alatornio, Finland</p>
                  </div>
                </div>
                <div className="carousel-item">
                  <img
                    src="/johanheikkuri.png"
                    className="d-block w-100"
                    alt="Photo 4"
                    style={{
                      height: "400px",
                      objectFit: "contain",
                      borderRadius: "20%",
                    }}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Johan "Juhani" Heikkuri</h5>
                  </div>
                </div>
                <div className="carousel-item">
                  <img
                    src="/anna.png"
                    className="d-block w-100 rounded-img"
                    alt="Photo 5"
                    style={{
                      height: "400px",
                      objectFit: "contain",
                      borderRadius: "20%",
                    }}
                  />
                  <div className="carousel-caption d-none d-md-block">
                    <h5>Anna Elisabet Heikkuri</h5>
                  </div>
                </div>
              </div>
              <button
                className="carousel-control-prev"
                type="button"
                data-bs-target="#photoCarousel"
                data-bs-slide="prev"
              >
                <span
                  className="carousel-control-prev-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Previous</span>
              </button>
              <button
                className="carousel-control-next"
                type="button"
                data-bs-target="#photoCarousel"
                data-bs-slide="next"
              >
                <span
                  className="carousel-control-next-icon"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Next</span>
              </button>
            </div>
            <div className="container my-5">
              <div className="row">
                <div className="col-md-10 offset-md-1">
                  {/* Section: Who are the Heikkuris? */}
                  <div className="card shadow-lg mb-5">
                    <div className="card-body">
                      <h1 className="card-title text-black mb-4">
                        Who are the Heikkuris?
                      </h1>
                      <p className="card-text lead">
                        The Heikkuris are a family with a rich history,
                        particularly associated with Johan Fredrik Heikkuri,
                        known as Juhani, who was a farmhand and later a farmer
                        in Alatornio. The family faced various challenges,
                        including personal losses and economic hardships, but
                        were known for their hard work and strong ties to their
                        community.
                      </p>
                      <p className="card-text">
                        Notable members include Anna Maria Heikkuri, the
                        youngest child of Juhani and his wife. Their story
                        reflects the resilience and determination that shaped
                        their lives in early 20th-century Finland.
                      </p>
                    </div>
                  </div>
                  {/* Section: What was it like to live in Finland in the early 1900s? */}
                  <div className="card shadow-lg">
                    <div className="card-body">
                      <h1 className="card-title text-black mb-4">
                        What was it like to live in Finland in the early 1900s?
                      </h1>
                      <p className="card-text lead">
                        Life in early 1900s Finland was a blend of rural
                        traditions and emerging industrialization. Many
                        families, like the Heikkuris, relied on agriculture for
                        their livelihood, often facing economic hardships and
                        labor-intensive work on farms.
                      </p>
                      <p className="card-text">
                        This period also saw social changes, with labor
                        movements and women's suffrage gaining momentum.
                        Finland's declaration of independence from Russia in
                        1917 brought new hope and transformation for its people.
                        Despite challenges, life revolved around community,
                        religious practices, and traditions, fostering strong
                        familial bonds and perseverance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
