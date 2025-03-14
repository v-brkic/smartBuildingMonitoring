const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { exec } = require('child_process'); 

const app = express();
const port = 5000;
app.use(cors());

// Konfiguracija za PostgreSQL
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'solar',
  password: 'bazepodataka',
  port: 5434,
});


const getChartData = (request, response) => {
  pool.query('SELECT proizvodnja, potrosnja,spremnik, datum FROM panel', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

app.get('/chartdata', getChartData);

const updateDataAndRunRmd = (callback) => {
  exec('Rscript -e "rmarkdown::render(\'/path/to/zavrsniRadPredikcije.Rmd\')"', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing Rmd script: ${error.message}`);
      callback(error, null);
      return;
    }
    if (stderr) {
      console.log(`Rmd script execution stderr: ${stderr}`);
    }
    console.log(`Rmd script executed successfully: ${stdout}`);
    callback(null, stdout);
  });
};

setInterval(updateDataAndRunRmd, 24 * 60 * 60 * 1000);

// Endpoint to update data and run Rmd script manually
app.get('/updateData', (req, res) => {
  updateDataAndRunRmd((err, result) => {
    if (err) {
      res.status(500).send("Failed to update data");
    } else {
      // Redirect to the main page where the data can be viewed
      res.redirect('/');
    }
  });
});

// Nova ruta za dohvaćanje zadnjih 64 redova iz tablice
app.get('/api/potrosnja', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM panel ORDER BY datum DESC LIMIT 64');
    res.json(result.rows);
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka iz baze:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*Novu ruta za zbroj potrošnje i proizvodnje po mjesecima 
WHERE
  EXTRACT(MONTH FROM datum) = 5
  AND EXTRACT(YEAR FROM datum) = 2018*/
  
app.get('/api/zbroj', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
  EXTRACT(MONTH FROM datum) AS mjesec,
  EXTRACT(YEAR FROM datum) AS godina,
  ROUND(SUM(potrosnja)) AS zbroj_potrosnje,
  ROUND(SUM(proizvodnja)) AS zbroj_proizvodnje,
  ROUND(SUM(spremnik)) AS zbroj_energije,
  ROUND(MAX(potrosnja)) AS max_potrosnja,
  ROUND(MAX(proizvodnja)) AS max_proizvodnja,
  ROUND(MAX(spremnik)) AS max_kolicina_energije,
  ROUND(AVG(potrosnja)) AS prosjek_potrosnje,
  ROUND(AVG(proizvodnja)) AS prosjek_proizvodnje,
  ROUND(AVG(spremnik)) AS prosjek_kolicine_energije
FROM
  panel
GROUP BY
  EXTRACT(YEAR FROM datum), EXTRACT(MONTH FROM datum)
ORDER BY
  godina, mjesec;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka iz baze:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
//dohvacanje godisnjih vrijednosti
app.get('/api/godisnji-zbroj', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
  EXTRACT(YEAR FROM datum) AS godina,
  ROUND(AVG(potrosnja)) AS prosjek_godisnje_potrosnje,
  ROUND(AVG(proizvodnja)) AS prosjek_godisnje_proizvodnje,
  ROUND(AVG(spremnik)) AS prosjek_godisnje_kolicine_energije
FROM
  panel
WHERE
  EXTRACT(YEAR FROM datum) = 2018
GROUP BY
  EXTRACT(YEAR FROM datum)
ORDER BY
  godina;
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka iz baze:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/podaci-za-datume', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let query = `
      SELECT
        EXTRACT(MONTH FROM datum) AS mjesec,
        EXTRACT(YEAR FROM datum) AS godina,
        ROUND(SUM(potrosnja)) AS zbroj_potrosnje,
        ROUND(SUM(proizvodnja)) AS zbroj_proizvodnje,
        ROUND(SUM(spremnik)) AS zbroj_energije,
        ROUND(MAX(potrosnja)) AS max_potrosnja,
        ROUND(MAX(proizvodnja)) AS max_proizvodnja,
        ROUND(MAX(spremnik)) AS max_kolicina_energije,
        ROUND(AVG(potrosnja)) AS prosjek_potrosnje,
        ROUND(AVG(proizvodnja)) AS prosjek_proizvodnje,
        ROUND(AVG(spremnik)) AS prosjek_kolicine_energije
      FROM
        panel
      WHERE
        datum BETWEEN $1 AND $2
      GROUP BY
        EXTRACT(YEAR FROM datum), EXTRACT(MONTH FROM datum)
      ORDER BY
        godina, mjesec;
    `;
    
    const result = await pool.query(query, [startDate, endDate]);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka za odabrane datume:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Nova ruta za dohvaćanje podataka za profile page
app.get('/api/profile', async (req, res) => {
  try {
    const result = await pool.query(`SELECT *
    FROM profil WHERE id=2`); // id ce se postavljat kada se korisnik prijavi, ali trenutno nemam login komponentu
    res.json(result.rows);
  } catch (error) {
    console.error('Greška pri dohvaćanju podataka iz baze:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.put("/api/update-profile/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { ime, prezime, solarPanel, username, password, email } = req.body || {};
    console.log("Received data for update:", req.body);
    // Execute SQL query to update data in the database
    const query = `
      UPDATE profil 
      SET ime=$1, prezime=$2, solarpanel=$3, username=$4, password=$5, email=$6 
      WHERE id=$7;`;

    const values = [ime, prezime, solarPanel, username, password, email, userId];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      // No rows were updated, user with specified id not found
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({ error: `Internal Server Error: ${error.message}` });
  }
});

// Pokretanje servera
app.listen(port, () => {
  console.log(`Backend server pokrenut na http://localhost:${port}`);
});
