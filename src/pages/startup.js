import React from 'react'
import  "../styles/pages/startup.scss";
import Lottie from "react-lottie";
import logoLottie from '../images/logo_lottie.json'

const StartUp = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: logoLottie,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  }

  return (
      <div className="start_up_mapper">
        <Lottie options={defaultOptions} height={28} width={56} />
      </div>
  )
}
export default StartUp;