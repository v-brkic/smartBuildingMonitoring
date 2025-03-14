import React, { useState, useEffect } from "react";

import "./ProfilePage.css";

const ProfilePage = () => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    const fetchDataFromDatabase = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/profile");
        const data = await response.json();
        if (data) {
          setUserData(data[0]);
        }
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      }
    };
    fetchDataFromDatabase();
  }, []);

  const updateDataInDatabase = async () => {
    try {
      console.log(userData.id);
      // Log the data being sent to the backend
      console.log("Data being sent to the backend:", userData);
      const response = await fetch(`http://localhost:5000/api/update-profile/${userData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ime: userData.ime,
          prezime: userData.prezime,
          solarPanel: userData.solarpanel,
          username: userData.username,
          password: userData.password,
          email: userData.email,
          id: userData.id,
        }),
      });
  
      const data = await response.json();
  
      if (data.error) {
        console.error("Error updating data:", data.error);
        return;
      }
  
      // Log the response from the backend
      console.log("Response from the backend:", data);
  
      // Update the state with the response data
      setUserData(data);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
  
  const handleInputChange = (field, value) => {
    setUserData((prevUserData) => ({
      ...prevUserData,
      [field]: value === null || value === undefined ? '' : value,
    }));
  };
  
  return (
    <>
      <div className="najjaciDiv">
        <form>
          <div className="row g-3">
            <div className="col-sm-6">
              <label className="form-label">Ime</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                value={userData.ime || ""}
                onChange={(e) => handleInputChange("ime", e.target.value)}
              />
              <div className="invalid-feedback">
                Valid first name is required.
              </div>
            </div>

            <div className="col-sm-6">
              <label className="form-label">Prezime</label>
              <input
                type="text"
                className="form-control"
                id="lastName"
                value={userData.prezime || ""}
                onChange={(e) => handleInputChange("prezime", e.target.value)}
              />
              <div className="invalid-feedback">
                Valid last name is required.
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Solarni panel</label>
              <select
                className="form-control"
                id="panelClass"
                value={userData.solarpanel || ""}
                onChange={(e) =>
                  handleInputChange("solarpanel", e.target.value)
                }
              >
                <option defaultValue disabled hidden>
                  {userData.solarPanel || ""}
                </option>
                <option value="vrsta1">Vrsta 1</option>
                <option value="vrsta2">Vrsta 2</option>
                <option value="vrsta3">Vrsta 3</option>
                <option value="vrsta4">Vrsta 4</option>
                <option value="vrsta5">Vrsta 5</option>
              </select>
              <div className="invalid-feedback">
                Molimo odaberite valjanu vrstu panela.
              </div>
            </div>

            <div className="col-sm-6">
              <label className="form-label">Korisničko ime</label>
              <div className="input-group has-validation">
                <span className="input-group-text">@</span>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  value={userData.username || ""}
                  onChange={(e) =>
                    handleInputChange("username", e.target.value)
                  }
                />
                <div className="invalid-feedback">
                  Your username is required.
                </div>
              </div>
            </div>

            <div className="col-sm-6">
              <label className="form-label">Lozinka</label>
              <div className="input-group has-validation">
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={userData.password || ""}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <div className="invalid-feedback">
                  Your password is required.
                </div>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={userData.email || ""}
                onChange={(e) => handleInputChange("email", e.target.value)}
              />
              <div className="invalid-feedback">
                Please enter a valid email address for shipping updates.
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <button
            type="button"
            className="btn btn-outline-dark me-2"
            onClick={updateDataInDatabase}
          >
            Spremi
          </button>
        </form>
      </div>
    </>
  );
};

export default ProfilePage;
