import React from "react"
import axios from 'axios'
import RightArrowImg from '../images/right_arrow.png'
import "../styles/components/purchase.scss";

const Purchases = (props) => {

  const db_url = props.db_url

  const postPurchases = async (movie, e) => {
    e.stopPropagation()
    const purchases_db = db_url + '/purchases'
      axios.post(purchases_db, {movie_id: movie.id}).then((res) => {
        console.log(res.data)
      }).catch((res) => {
        console.log(res)
      })
    }

  return (
    <a className="wrapper-purchases" href={props.affiliateLink} onClick={(e) => postPurchases(props.movie, e)}>
      つづきを見る
      <img className="right-arrow" alt="" width="10" height="10" src={RightArrowImg}  />
    </a>
  )
}

export default Purchases