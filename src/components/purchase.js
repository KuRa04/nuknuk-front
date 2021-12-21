import React from "react"
import axios from 'axios'
import RightArrowImg from '../images/right_arrow.svg'
import "../styles/components/purchase.scss";

const Purchases = (props) => {

  const dbUrl = process.env.REACT_APP_HEROKU_DB_URL;
  // const dbUrl = process.env.REACT_APP_LOCAL_DB_URL

  const postPurchases = async (movie, e) => {
    e.stopPropagation()
    const purchases_db = dbUrl + '/purchases'
      console.log(props.ip_address)
      axios.post(purchases_db, {movie_id: movie.id, ip_address: props.ip_address}).then((res) => {
        console.log(res.data)
      }).catch((res) => {
        console.log(res)
      })
    }

  return (
    <a className="wrapper_purchases" href={props.affiliateLink} onClick={(e) => postPurchases(props.movie, e)}>
      詳細を見てみる！
      <img className="right_arrow" alt="" width="10" height="10" src={RightArrowImg}  />
    </a>
  )
}

export default Purchases