import React from 'react';
import BeforeFavoriteImg from '../images/before_favorite.svg'
import RightArrowImg from '../images/right_arrow.svg'
import ShareButton from '../images/share.svg'
import "../styles/components/entity_empty_video.scss";

const EntityEmptyVideo  = () => {
  return (
    <div className="wrapper_entity_video">
      <div className="entity_empty_component"></div>
      <div className="entity_btn_object">
        <div className="wrapper_entity_title">
          <p className="entity_video_title"></p>
          <div className="wrapper_entity_purchases">
            <p className="entity_detail_text">詳細を見てみる！</p>
            <img className="entity_right_arrow_icon" alt="" width="14" height="14" src={RightArrowImg}  />
          </div>
        </div>
        <div className="wrapper_entity_share_and_favorites_btn">
          <div className="wrapper_entity_favorites_btn">
            <img alt="" width="35" height="35" src={BeforeFavoriteImg} />
          </div>
          <div className="wrapper_entity_share_btn">
          <img src={ShareButton} alt='menu' width={35} height={35} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntityEmptyVideo