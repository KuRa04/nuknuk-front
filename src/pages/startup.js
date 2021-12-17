import React, { useEffect }  from 'react'
// import { useHistroy } from 'react-router-dom';
import StartUpImg from '../images/startup.svg'
import  "../styles/pages/startup.scss";

const StartUp = () => {
  // const navigate = useHistroy();

  // 3秒後に年齢確認画面に遷移
  useEffect( () => {
    window.setTimeout(function(){
    //  navigate.push("/Movie")
    }, 1000);
  });

  return (
      <div className="start_up_mapper">
        <img clasName="startup-img" src={StartUpImg} alt=""/>
      </div>
  );
};
export default StartUp;