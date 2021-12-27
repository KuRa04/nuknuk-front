import React from "react"
import BeforeFavoriteImg from '../images/before_favorite.svg'
import AfterFavoriteImg from '../images/after_favorite.svg'
import "../styles/components/favorite.scss"

const Favorites = (props) => {
  return (
    <div className="wrapper_favorites_btn" onClick={(e) => props.postFavorites(e)}>
      <img alt="" width="35" height="35" src={props.movie.is_favorited ? AfterFavoriteImg : BeforeFavoriteImg} />
      <span className="video_favorites_count">{props.movie.favorites_count}</span>
    </div>
  )
}

export default Favorites;