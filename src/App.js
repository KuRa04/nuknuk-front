import React from 'react';
import Movies from './pages/Movies.js';
import './App.css';

function App() {
  return (
    <>
      <Movies ip_address="127.0.0.1" db_url="http://localhost:3000/api/v1"/>
    </>
  );
}

export default App;
