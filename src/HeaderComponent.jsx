import React from "react";
import { Link } from "react-router-dom";

const HeaderComponent = () => {
  return (
    <>
      <header data-bs-theme="dark" className="bg-custom">
        <div className="text-bg-dark collapse" id="navbarHeader">
          <div className="container">
            <div className="row">
              <div className="col-sm-8 col-md-7 py-4">
                <h4>About</h4>
                <p className="text-body-secondary">
                  Ja sam Vinko Brkić, završavam 3. godinu FER-a i ovaj projekt sam napravio u sklopu
                  kolegija "Projekt R" i "Završni rad".
                </p>
              </div>
              <div className="col-sm-4 offset-md-1 py-4">
                <h4>Contact</h4>
                <ul className="list-unstyled">
                  <li>
                    <a href="#" className="text-white">
                      Adresa, 10000
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white">
                      +385242453538
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white">
                      vinko.brkic@fer.hr
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <div className="dropdown text-end">
              <a
                href="#"
                className="d-block link-body-emphasis text-decoration-none dropdown-toggle text-light"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src="./logo2.svg"
                  alt="logo"
                  width="32"
                  height="32"
                  className="rounded-circle"
                />
              </a>
              <ul className="dropdown-menu text-small">
                <li>
                  <Link to="/" className="dropdown-item ">
                    Main Page
                  </Link>
                </li>
                <li>
                  <Link to="/profil" className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link to="/history" className="dropdown-item">
                    History
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link to="/" className="dropdown-item ">
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
            <button
              className="navbar-toggler collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarHeader"
              aria-controls="navbarHeader"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default HeaderComponent;
