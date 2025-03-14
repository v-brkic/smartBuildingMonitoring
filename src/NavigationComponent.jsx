import React, { useState } from 'react';
import './NavigationComponent.css';

const NavigationComponent = () => {
  const [openItems, setOpenItems] = useState([]);

  const handleItemClick = (item) => {
    if (openItems.includes(item)) {
      // ako je trenutni item već otvoren, zatvori ga
      setOpenItems(openItems.filter((openItem) => openItem !== item));
    } else {
      // inace, dodaj trenutni item u listu otvorenih
      setOpenItems([...openItems, item]);
    }
  };

  const isItemOpen = (item) => openItems.includes(item); //varijbla koja mi govori jeli element otvoren ili ne

  return ( //klasicni html
    <div className="navigation">
      <div className="nav-header">Prezime kućanstva</div>
      <div className="nav-divider"></div>
      <div
        className={`nav-item ${isItemOpen('Potrosnja') && 'active'}`} //dinamicko dodjeljivanje CSS klase, ako je aktivno(kliknuto)
        onClick={() => handleItemClick('Potrosnja')}//event handler, otvara/zatvara element navigacije
      >
        <div>Kućanski uređaji</div>
        {isItemOpen('Potrosnja') && (
          <div className="sub-item">
            <ul>
              <li>Natuknica 1 koja bude svojom duljinom prelazila u novi red navigacije</li>
              <li>Natuknica 2</li>
              <li>Natuknica 3</li>
            </ul>
          </div>
        )}
      </div>
      <hr />
      <div
        className={`nav-item ${isItemOpen('Usteda') && 'active'}`}
        onClick={() => handleItemClick('Usteda')}
      >
        <div>Potrošnja energije</div>
        {isItemOpen('Usteda') && (
          <div className="sub-item">
            <ul>
              <li>Natuknica 1 koja bude svojom duljinom prelazila u novi red navigacije</li>
              <li>Natuknica 2</li>
              <li>Natuknica 3</li>
            </ul>
          </div>
        )}
      </div>
      <hr />
      <div
        className={`nav-item ${isItemOpen('Proizvedena') && 'active'}`}
        onClick={() => handleItemClick('Proizvedena')}
      >
        <div>Proizvedena energija</div>
        {isItemOpen('Proizvedena') && (
          <div className="sub-item">
            <ul>
              <li>Natuknica 1 koja bude svojom duljinom prelazila u novi red navigacije</li>
              <li>Natuknica 2</li>
              <li>Natuknica 3</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationComponent;
