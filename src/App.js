import React, {useState, useEffect} from 'react';
import axios from 'axios'
import Movies from './pages/Movies.js';
import StartUp from './pages/startup.js';
import './App.css';

function App() {
  const [ip, setIP] = useState('');
  const [isOpen, setOpen] = useState(false)

  //creating function to load ip address from the API
  const getData = async () => {
    const res = await axios.get('https://ipinfo.io/?callback')
    setIP(res.data.ip)
  }

  useEffect( () => {
    //passing getData method to the lifecycle method
    getData()

  }, [])

  useEffect(() => {
    window.setTimeout(() => {
      setOpen(true)
    }, 1000)
  }, [ip])

  const displayLottie = () => {
    setOpen(false)
    window.setTimeout(() => {
      setOpen(true)
    }, 1000)
  }
  return (
    <>
    { !isOpen ?
      <StartUp />
    :
      <Movies ip_address={ip} displayLottie={() => displayLottie()} />
    }
    </>
  );
}

export default App;
