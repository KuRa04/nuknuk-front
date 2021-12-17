import React from 'react'
import StartUpImg from '../images/startup.svg'
import  "../styles/pages/startup.scss";

const StartUp = () => {
  return (
      <div className="start_up_mapper">
        <img clasName="startup-img" src={StartUpImg} alt=""/>
      </div>
  );
};
export default StartUp;