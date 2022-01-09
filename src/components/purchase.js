import React from "react"
import RightArrowImg from '../images/right_arrow.svg'
import purchaseController from "../controller/purchase_controller"
import "../styles/components/purchase.scss";

const Purchases = (props) => {
  const postPurchases = async (movie, e) => {
    e.stopPropagation()
    purchaseController.postPurchase(movie.id, props.ip_address)
    }

  return (
    <div className="wrapper_title">
      <p className="movie_title">{props.title}</p>
      <a className="wrapper_purchases"
        target="_blank"
        rel="noreferrer noopener"
        href={props.affiliateLink}
        onClick={(e) => postPurchases(props.movie, e)}
      >
        <p className="detail-text">詳細を見てみる！</p>
        <img className="right_arrow" alt="" width="14" height="14" src={RightArrowImg}  />
      </a>
    </div>
  )
}

export default Purchases