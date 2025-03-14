import React, { useState, useEffect, useRef } from "react";
import Plot from "react-plotly.js";
import axios from 'axios';
import "./GraphComponent.css";
import { DateRangePicker } from 'react-date-range';
import { format } from 'date-fns';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme css file
import WeatherComponent from "./WeatherComponent";

const GraphComponent = () => {
  const [bazaPotrosnja, setBazaPotrosnja] = useState([]);
  const [bazaZbroj, setBazaZbroj] = useState([]);
  const [bazaGodisnji, setBazaGodisnji] = useState([]);
  const isMounted = useRef(true);
  //dodat glob varijablu koja prati koji je mjesec
  //const [startDate, setStartDate] = useState(new Date());
  //const [endDate, setEndDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);

  const [processedData, setProcessedData] = useState([]);
  const [sellData, setSellData] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response1 = await fetch('/future_potrosnja_pred.csv');
        const response2 = await fetch('/future_proizvodnja_pred.csv');
        const response3 = await fetch('/future_spremnik_pred.csv');
        const response4 = await fetch('/future_energy_surplus.csv');
  
        const data1 = await response1.text();
        const data2 = await response2.text();
        const data3 = await response3.text();
        const data4 = await response4.text();
  
        const csvDataArray = [data1, data2, data3];
        console.log("sell data:");
        console.log(data4)
        setSellData(data4)
        const processedData = processMultipleCSVs(csvDataArray);
  
        console.log("Processed Data:");
        console.log(processedData);
  
        setProcessedData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  
  const processData = (data) => {
    const lines = data.split('\n');
    const result = [];
  
    for (let i = 1; i < lines.length; i++) {
      const currentLine = lines[i].split(',');
      const value = parseFloat(currentLine[1]);
  
      if (!isNaN(value)) {
        result.push(value);
      }
    }
  
    return result;
  };
  
  const processMultipleCSVs = (csvDataArray) => {
    const processedData = [];
  
    csvDataArray.forEach((csvData) => {
      const numericValues = processData(csvData);
      processedData.push(numericValues);
    });
  
    return processedData;
  };
  
  

  const handleDateChange = (ranges) => {
    const { startDate, endDate } = ranges.selection;
    const formattedStartDate = startDate ? format(startDate, 'yyyy-MM-dd') : '';
    const formattedEndDate = endDate ? format(endDate, 'yyyy-MM-dd') : '';
  
    console.log("Start Date:", formattedStartDate);
    console.log("End Date:", formattedEndDate);
  
    if (formattedStartDate && formattedEndDate) {
      axios.get(`http://localhost:5000/api/podaci-za-datume?startDate=${formattedStartDate}&endDate=${formattedEndDate}`)
        .then((response) => {
          console.log(response.data);
          setBazaZbroj(response.data);
        })
        .catch((error) => {
          console.error('Greška pri dohvaćanju podataka:', error);
        });
    } else {
      console.log("Datumi nisu odabrani.");
    }
  };
  

  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  //fetchanje podataka iz baze za grafove
  useEffect(() => {
    isMounted.current = true;

    const fetchData = async () => {
      try {
        const [responsePotrosnja, responseZbroj, responseGodisnji] =
          await Promise.all([
            fetch("http://localhost:5000/api/potrosnja"),
            fetch("http://localhost:5000/api/zbroj"),
            fetch("http://localhost:5000/api/godisnji-zbroj"),
          ]);
        const dataPotrosnja = await responsePotrosnja.json();
        const dataZbroj = await responseZbroj.json();
        const dataGodisnji = await responseGodisnji.json();
        if (isMounted.current) {
          setBazaPotrosnja(dataPotrosnja);
          setBazaZbroj(dataZbroj);
          setBazaGodisnji(dataGodisnji);
        }
      } catch (error) {
        console.error("Greška pri dohvaćanju podataka:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(fetchData, 1000000);
    const stopIntervalTime = 1800000; // 30 minuta
    setTimeout(() => clearInterval(intervalId), stopIntervalTime);
    return () => {
      isMounted.current = false;
    };
  }, []);

  //Prvi graf
  var data1 = [
    {
      type: "indicator",
      mode: "number+delta",
      value:
        bazaPotrosnja.reduce((acc, val) => acc + val.potrosnja, 0) /
        bazaPotrosnja.length, //prosjek vrijednosti
      delta: { reference: 512, valueformat: ".0f" },
      domain: { y: [0, 1], x: [0.25, 0.75] },
      title: { text: "Potrošnja" },
    },
    {
      y:
        Array.isArray(bazaPotrosnja) && bazaPotrosnja.length > 0
          ? bazaPotrosnja.map((entry) => entry.potrosnja || 0)
          : [],
      //y: [325, 324, 405, 400, 424, 404, 417, 432, 419, 394, 410, 426, 413, 419, 404, 408, 401, 377, 368, 361, 356, 359, 375, 397, 394, 418, 437, 450, 430, 442, 424, 443, 420, 418, 423, 423, 426, 440, 437, 436, 447, 460, 478, 472, 450, 456, 436, 418, 429, 412, 429, 442, 464, 447, 434, 457, 474, 480, 499, 497, 480, 502, 512, 492]
    }, //64 vrijednosti
  ];

  const layout1 = { xaxis: { range: [0, 62] } };

  //drugi graf
  var data2 = [
    {
      domain: { x: [0, 1], y: [0, 1] },
      value:
        Array.isArray(bazaPotrosnja) && bazaPotrosnja.length > 0
          ? bazaPotrosnja[0].spremnik
          : 0,
      title: { text: "Spremnik" },
      type: "indicator",
      mode: "gauge+number",
      delta: { reference: 300 },
      gauge: { axis: { range: [null, 1000] } },
    },
  ];

  const layout2 = {};

  //Treci graf
  var data3 = [
    {
      values: [16, 15, 12, 6, 5, 4, 42],
      labels: [
        "Perilica rublja",
        "Indukcijska ploča",
        "Perilica suđa",
        "Pečnica",
        "Televizija",
        "Utičnice",
      ],
      domain: { column: 0 },
      name: "GHG Emissions",
      hoverinfo: "label+percent+name",
      hole: 0.4,
      type: "pie",
    },
    {
      values: [27, 11, 25, 8, 4, 3, 25],
      labels: [
        "Utičnice",
        "Indukcijska ploča",
        "Perilica suđa",
        "Pečnica",
        "Televizija",
        "Perilica rublja",
      ],
      text: "CO2",
      textposition: "inside",
      domain: { column: 1 },
      name: "CO2 Emissions",
      hoverinfo: "label+percent+name",
      hole: 0.4,
      type: "pie",
    },
  ];

  var layout3 = {
    title: "Postotak ukupnog udjela potrošnje uređaja",
    annotations: [
      {
        font: {
          size: 20,
        },
        showarrow: false,
        text: "Solar",
        x: 0.17,
        y: 0.5,
      },
      {
        font: {
          size: 20,
        },
        showarrow: false,
        text: "HEP",
        x: 0.82,
        y: 0.5,
      },
    ],
    width: 600,
    height: 400,
    showlegend: true,
    grid: { rows: 1, columns: 2 },
  };

  //Cetvrti graf
  var trace1 = {
    x: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    y:
      Array.isArray(bazaZbroj) && bazaZbroj.length > 0
        ? bazaZbroj.map((entry) => entry.zbroj_potrosnje || 0)
        : [],
    //[20, 14, 25, 16, 18, 22, 19, 15, 12, 16, 14, 17],
    type: "bar",
    name: "Proizvedena energija",
    marker: {
      color: "black",
      opacity: 0.7,
    },
  };

  var trace2 = {
    x: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    y:
      Array.isArray(bazaZbroj) && bazaZbroj.length > 0
        ? bazaZbroj.map((entry) => entry.zbroj_proizvodnje || 0)
        : [],
    //[19, 14, 22, 14, 16, 19, 15, 14, 10, 12, 12, 16],
    type: "bar",
    name: "Potrošena energija ",
    marker: {
      color: "red",
      opacity: 0.5,
    },
  };

  var data4 = [trace1, trace2];

  var layout4 = {
    title: "2024 Godina",
    xaxis: {
      tickangle: -45,
    },
    barmode: "group",
  };

  return (
    <div>
      {/* SEKCIJA ZA GRAFOVE*/}

      <div className="percentage-container ">
        <div className="graph-container" id="potrosnja">
          <h3>Potrošnja energije</h3>
          <Plot
            data={data1}
            layout={{ width: "650", height: "450" }}
            config={{ responsive: true }}
          />
        </div>
        <div className="p-5 mb-4 bg-body-tertiary customRound" id="spremnik">
          <div className="graph-container">
            <h3>Spremnik</h3>
            <Plot
              data={data2}
              layout={{ width: "550", height: "450" }}
              config={{ responsive: true }}
            />
          </div>
        </div>
        <div className="p-5 mb-4 bg-body-tertiary customRound">
          <div className="graph-container">
            <h3>Postotak ukupnog udjela potrošnje uređaja</h3>
            <Plot
              data={data3}
              layout={{ ...layout3, width: "550", height: "450" }}
              config={{ responsive: true }}
            />
          </div>
        </div>
        <div className="graph-container" id="proizvodnja">
          <h3>Omjer proizvedene i potrošene energije kroz godinu</h3>
          <Plot
            data={data4}
            layout={{
              ...layout4,
              width: "650",
              height: "450",
            }}
            config={{ responsive: true }}
          />
        </div>
      </div>

      {/* SEKCIJA ZA STATISTIKU*/}
      <div className="container px-4 py-5">
      <div>
      <h2>Processed CSV Data</h2>
      <ul>
        {processedData.map((data, index) => (
          <li key={index}>
            <h3>Data {index + 1}</h3>
            <ul>
              {data.map((value, idx) => (
                <li key={idx}>
                  Value: {value}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
        <h2 className="pb-2 border-bottom">STATISTIKA</h2>
        <div className="datepicker-container mb-3">
          <button className="btn btn-outline-dark m-1" onClick={toggleCalendar}>
            Odaberi datum
          </button>
          {showCalendar && (
            <div>
            <DateRangePicker
              ranges={dateRange}
              onChange={handleDateChange}
            />
            <div>
              Start Date: {dateRange[0].startDate && dateRange[0].startDate.toDateString()}
            </div>
            <div>
              End Date: {dateRange[0].endDate && dateRange[0].endDate.toDateString()}
            </div>
          </div>
          )}
        </div>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th></th>
                <th>
                  <h5>POTROŠNJA</h5>
                </th>
                <th>
                  <h5>PROIZVODNJA</h5>
                </th>
                <th>
                  <h5>SPREMNIK</h5>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Prosječna <b>godišnja</b> količina
                </td>
                <td>
                  {bazaGodisnji && bazaGodisnji.length > 0
                    ? bazaGodisnji[0].prosjek_godisnje_potrosnje
                    : "Nema podataka"}
                </td>
                <td>
                  {bazaGodisnji && bazaGodisnji.length > 0
                    ? bazaGodisnji[0].prosjek_godisnje_proizvodnje
                    : "Nema podataka"}
                </td>
                <td>
                  {bazaGodisnji && bazaGodisnji.length > 0
                    ? bazaGodisnji[0].prosjek_godisnje_kolicine_energije
                    : "Nema podataka"}
                </td>
              </tr>
              <tr>
                <td>
                  Potrošnja za <b>odabrani mjesec</b>: <b>prosječna</b> količina
                  energije <b>po danu</b>
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].prosjek_potrosnje
                    : "Nema podataka"}
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].prosjek_proizvodnje
                    : "Nema podataka"}
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].prosjek_kolicine_energije
                    : "Nema podataka"}
                </td>
              </tr>
              <tr>
                <td>
                  Potrošnja za <b>odabrani mjesec</b>: <b>ukupna mjesečna</b>{" "}
                  količina energije
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].zbroj_potrosnje
                    : "Nema podataka"}
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].zbroj_proizvodnje
                    : "Nema podataka"}
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].zbroj_energije
                    : "Nema podataka"}
                </td>
              </tr>
              <tr>
                <td>
                  Potrošnja za <b>odabrani mjesec</b>: <b>maksimalna</b>{" "}
                  količina energije <b>u jednom danu</b>
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].max_potrosnja
                    : "Nema podataka"}
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].max_proizvodnja
                    : "Nema podataka"}
                </td>
                <td>
                  {bazaZbroj && bazaZbroj.length > 0
                    ? bazaZbroj[0].max_kolicina_energije
                    : "Nema podataka"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        

        <div className="row row-cols-1 row-cols-md-2 align-items-md-center g-5 py-5">
          <div className="col d-flex flex-column align-items-start gap-2">
            <h2 className="fw-bold text-body-emphasis">
              Višak energije izračunat algoritmom za prodaju HEP-u
            </h2>

            <p>
              Preporučena količina energije za prodat: <br />{" "}
              <b className="vrijednosti2">
                {/*}{bazaZbroj && bazaZbroj.length > 0 ? (
                  bazaZbroj[0].zbroj_energije > bazaZbroj[0].zbroj_potrosnje ? (
                    (bazaZbroj[0].zbroj_energije -
                      bazaZbroj[0].zbroj_potrosnje) /
                    3
                  ) : (
                    <span>Nema viška energije</span>
                  )
                ) : (
                  <span>Nedostaju podaci za izračun</span>
                )}{*/}
                {sellData}
              </b>
            </p>
            <a href="#" className="btn btn-primary btn-lg">
              Prodaj HEP-u
            </a>
          </div>

          <div className="col d-flex flex-column gap-2">
            <h4 className="fw-semibold mb-0 text-body-emphasis">
              VREMENSKA PROGNOZA
            </h4>
            <p className="text-body-secondary">
              <WeatherComponent />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GraphComponent;
