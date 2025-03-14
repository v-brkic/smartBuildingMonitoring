<div className="container px-4 py-5" id="hanging-icons">
          <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
            <div className="col d-flex align-items-start">
              <div>
                <svg className="bi" width="1em" height="1em">
                  <use href="#toggles2"></use>
                </svg>
              </div>
              <div>
                <h3 className="fs-2 customColor1">POTROŠNJA</h3>
                <ul>
                  <li>
                    Prosječna godišnja potrošnja: <br />
                    {bazaGodisnji && bazaGodisnji.length > 0 ? (
                      <b className="vrijednosti customColor1">
                        {bazaGodisnji[0].prosjek_godisnje_potrosnje} {/* ovisno koi je mjesec cu birati koji red uzmem}{*/}
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                  </li>
                  <li>
                    Potrošnja za ovaj mjesec: <br />
                    ukupna: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor1">
                        {bazaZbroj[0].zbroj_potrosnje} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                    prosječna po danu: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor1">
                        {bazaZbroj[0].prosjek_potrosnje} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                    maksimalna u jednom danu: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor1">
                        {bazaZbroj[0].max_potrosnja} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                  </li>
                </ul>
                <a href="#spremnik" className="btn btn-outline-dark me-2">
                  Vidi graf!
                </a>
              </div>
            </div>
            <div className="col d-flex align-items-start">
              <div>
                <svg className="bi" width="1em" height="1em">
                  <use href="#cpu-fill"></use>
                </svg>
              </div>
              <div>
                <h3 className="fs-2 customColor2">PROIZVODNJA</h3>
                <ul>
                  <li>
                    Prosječna godišnja proizvodnja: <br />
                    {bazaGodisnji && bazaGodisnji.length > 0 ? (
                      <b className="vrijednosti customColor2">
                        {bazaGodisnji[0].prosjek_godisnje_proizvodnje}
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                  </li>
                  <li>
                    Proizvodnja za ovaj mjesec: <br />
                    ukupna: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor2">
                        {bazaZbroj[0].zbroj_proizvodnje} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                    prosječna po danu: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor2">
                        {bazaZbroj[0].prosjek_proizvodnje} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                    maksimalna u jednom danu: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor2">
                        {bazaZbroj[0].max_proizvodnja} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                  </li>
                </ul>
                <a href="#spremnik" className="btn btn-outline-dark me-2">
                  Vidi graf!
                </a>
              </div>
            </div>
            <div className="col d-flex align-items-start">
              <div>
                <svg className="bi" width="1em" height="1em">
                  <use href="#tools"></use>
                </svg>
              </div>
              <div>
                <h3 className="fs-2 customColor3">SPREMNIK</h3>
                <ul>
                  <li>
                    Prosječna godišnja zaliha energije: <br />
                    {bazaGodisnji && bazaGodisnji.length > 0 ? (
                      <b className="vrijednosti customColor3">
                        {bazaGodisnji[0].prosjek_godisnje_kolicine_energije}
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                  </li>
                  <li>
                    Zaliha energije za ovaj mjesec: <br />
                    ukupna: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor3">
                        {bazaZbroj[0].zbroj_energije} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                    prosječna po danu: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor3">
                        {bazaZbroj[0].prosjek_kolicine_energije} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                    maksimalna u jednom danu: <nbsp />
                    {bazaZbroj && bazaZbroj.length > 0 ? (
                      <b className="vrijednosti customColor3">
                        {bazaZbroj[0].max_kolicina_energije} <br />
                      </b>
                    ) : (
                      <span>Nema podataka</span>
                    )}
                  </li>
                </ul>
                <a href="#spremnik" className="btn btn-outline-dark me-2">
                  Vidi graf!
                </a>
              </div>
            </div>
          </div>
        </div>