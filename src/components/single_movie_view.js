import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'
import useInView from "react-cool-inview"
import { Modal } from '@material-ui/core'
import VideoStartIcon from '../images/video_start.svg'
import BeforeFavoriteImg from '../images/before_favorite.svg'
import AfterFavoriteImg from '../images/after_favorite.svg'
import favoritesController from '../controller/favorites_controller'
import viewListsController from '../controller/view_lists_controller'
import Shares from './share'
import Purchases from './purchase'
import VideoComponent from './video'


/**
   * @param {*} props movie title movieImage movieUrl favoritesCount affiliateLink ip_address
   * @return {*}
   */
 const SingleMovieView = (props) => {
  const [isPlaying, setPlaying] = useState(true)
  const [isFavorited, setFavorited] = useState(props.isFavorited) //TODO propsではなくmovieの中から渡す
  const [favoriteCount, setFavoriteCount] = useState(props.favoritesCount)
  const [isModalAfterViewing, openModalAfterViewing] = useState(false)
  const videoRef = useRef();
  const wrapVideoRef = useRef();

  //TODO 一つにまとめたい
  useEffect(() => {
    setFavorited(isFavorited)
  }, [isFavorited])

  useEffect(() => {
    setFavoriteCount(favoriteCount)
  }, [favoriteCount])

  /**
   *
   * @param {*} movie いいねしたい動画
   * @param {*} e イベントハンドラ
   */
  const postFavorites = async (movie, e) => {
    e.stopPropagation()
    let newCount = 0
    if (isFavorited) {
      newCount = await favoritesController.deleteFavorite(movie.id, props.ip_address)
    } else {
      newCount = await favoritesController.createFavorite(movie.id, props.ip_address)
    }
    setFavorited(!isFavorited)
    setFavoriteCount(newCount)
  }
  
  /**
   * @param {*} movie //動画一覧
   */
  const postViewList = async (movie) => {
    await viewListsController.postViewList(movie.id, props.ip_address)
  }

  let tapCount = 0 //TODO useStateで書き換える
  
  /**
   *
   * @param {*} e イベントハンドラ
   */
  const toggleTappedProcess = (e) => {
    e.preventDefault()
    if (!tapCount) {
      ++tapCount
      setTimeout(() => {
        if (!isPlaying && !!tapCount) {
          videoRef.current && videoRef.current.play()
          setPlaying(true)
        } else if (isPlaying && !!tapCount) {
          videoRef.current && videoRef.current.pause()
          setPlaying(false)
        }
        tapCount = 0
      }, 500)
    } else {
      postFavorites(props.movie, e)
      tapCount = 0
    }
  }

  /**
   * リプレイボタンを押したときに動画を再生
   */
  const replayVideo = () => {
    openModalAfterViewing(!isModalAfterViewing);
    videoRef.current && videoRef.current.play();
    setPlaying(true);
  }

  const { observe } = useInView({
    threshold: 1,
    onEnter: async ({ observe, unobserve }) => {
      unobserve()
      setPlaying(true)
      // const movieId = wrapVideoRef.current.id.split('video-player-')[1]
      // const movie = movieListCopy.filter((movie) => movie.id === Number(movieId))[0]
      
       props.isLastVideo && props.getNextMovieLists()
  
      postViewList(props.movie)
      ReactDOM.render(
        <VideoComponent
          movie={props.movie}
          videoRef={videoRef}
          onEnded={() => openModalAfterViewing(!isModalAfterViewing)}
        />,
        document.getElementById("video-player-" + props.movie.id)
      )
      videoRef.current && videoRef.current.play()
      observe()
    },
    onLeave: ({ observe, unobserve }) => {
      unobserve()
      videoRef.current && videoRef.current.pause()
      videoRef.current.currentTime = 0
      const movieId = wrapVideoRef.current.id.split('video-player-')[1]
      let movie = document.getElementById("video-player-" + movieId).replaceChildren
      movie = null
      console.log(movie)
      observe()
    },
  })

  return (
      <div className="wrapper_movie" id={"movie-url-" + props.movie.id}>
        {
          !isPlaying &&
          <div className="video_start_icon">
            <img src={VideoStartIcon} alt="" width={48} height={59}/>
          </div>
        }
        <div ref={observe}>
          <div className="empty_component" id={"video-player-" + props.movie.id} ref={wrapVideoRef} onTouchStart={(e) => toggleTappedProcess(e)}></div>
        </div>
        {
          !isModalAfterViewing &&
          <div className="btn_object">
            <Purchases
              movie={props.movie}
              title={props.title}
              affiliateLink={props.affiliateLink}
              ip_address={props.ip_address}
            />
            <div className="video_btn">
              <div className="wrapper_favorites">
                <img onClick={(e) => postFavorites(props.movie, e)} alt="" width="35" height="35" src={isFavorited ? AfterFavoriteImg : BeforeFavoriteImg} />
                <span className="favorites_count">{favoriteCount}</span>
              </div>
              <div className="share_btn">
                <Shares
                  movie={props.movie}
                  ip_address={props.ip_address}
                  onToggle={props.toggleShareDrawer}
                />
              </div>
            </div>
          </div>
        }
        <Modal open={isModalAfterViewing} style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div className="after_movie_modal">
            <Purchases
              movie={props.movie}
              title={props.title}
              affiliateLink={props.affiliateLink}
              ip_address={props.ip_address}
            />
            <div className="replay_text" onTouchStart={() => replayVideo()}>リプレイ</div>
          </div>
        </Modal>
       </div>
  )
}

export default SingleMovieView