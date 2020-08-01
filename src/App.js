import React, { useState, useEffect } from 'react';
import './App.css';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import InfoBox from './components/InfoBox/InfoBox';
import Table from './components/Table/Table';
import LineGraph from './components/LineGraph/LineGraph';
import { sortData } from './util';

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
      fetch('https://disease.sh/v3/covid-19/all')
      .then(res => res.json())
      .then((data) => {
        setCountryInfo(data);
      });
  },[]);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then(res => res.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name: country.country,
            value: country.countryInfo.iso2
          }
        ));

        const sortedData = sortData(data);
        console.log(sortedData)
        setTableData(sortedData);
        setCountries(countries);
      });
    }
    getCountriesData();
  },[]);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide' 
        ? 'https://disease.sh/v3/covid-19/all'
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          setCountry(countryCode);
          setCountryInfo(data);
        })
  }
  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>Covid-19 Tracker</h1>
        <FormControl className='app__dropdown'>
            <Select 
              variant="outlined"
              value={country}
              onChange={onCountryChange} 
            >
              <MenuItem value="worldwide">WorldWide</MenuItem>
              {
                countries.map((country) => {
                  return (
                    <MenuItem value={country.value}>{country.name}</MenuItem>
                  )
                })
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
            <InfoBox title="Coronavirus cases" cases={countryInfo.todayCases} total={countryInfo.cases}/>
            <InfoBox title="Recovered cases" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
            <InfoBox title="Deaths cases" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
        <div className='app__linegraph'>
          <h3>Worldwide New Cases</h3>
          <LineGraph />
        </div>
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by country</h3>
          <Table countries={tableData} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
