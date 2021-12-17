import React, { ReactElement, useEffect }  from 'react'
import Image from 'next/image'
import StartUpImg from '../../public/images/startup.svg'
import styles from "../../styles/pages/start_up.module.css";
import useRouter from 'next/router'

const StartUp = () => {

  // 3秒後に年齢確認画面に遷移
  useEffect( () => {
    window.setTimeout(function(){
      useRouter.push("/age_confirm")
    }, 1000);
  });

  return (
    <>
      <div className={styles.start_up_mapper}>
        <Image src={StartUpImg} alt=""/>
      </div>
    </>
  );
};
export default StartUp;