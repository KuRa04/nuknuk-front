import React from 'react';
import BeforeFavoriteImg from '../images/before_favorite.svg'
import RightArrowImg from '../images/right_arrow.svg'
import ShareButton from '../images/share.svg'

const EntityEmptyVideo  = () => {
  return (
    <div className="wrapper_movie">
      <div className="btn_object">
        <div className="wrapper_title">
          <p className="movie_title"></p>
          <div className="wrapper_purchases" alt="" href="">
            <p className="detail-text">詳細を見てみる！</p>
            <img className="right_arrow" alt="" width="14" height="14" src={RightArrowImg}  />
          </div>
        </div>
        <div className="video_btn">
          <div className="wrapper_favorites">
            <img alt="" width="35" height="35" src={BeforeFavoriteImg} />
          </div>
          <div className="share_btn">
          <img src={ShareButton} alt='menu' width={35} height={35} />
          </div>
        </div>
      </div>
    </div>
  )
  
}

export default EntityEmptyVideo