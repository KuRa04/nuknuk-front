import React, {useState, useEffect} from 'react';
import axios from 'axios'
import Movies from './pages/Movies.js';
import './App.css';

function App() {
  const [ip, setIP] = useState('');

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get('https://ipinfo.io/?callback')
    setIP(res.data.ip)
  }

  useEffect( () => {
    //passing getData method to the lifecycle method
    getData()

  }, [])
  return (
    <>
      <Movies ip_address={ip} dbUrl={process.env.REACT_APP_HEROKU_DB_URL} />
    </>
  );
}

export default App;
