import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'
import useInView from "react-cool-inview"
import { Modal } from '@material-ui/core'
import VideoStartIcon from '../images/video_start.svg'
import favoritesController from '../controller/favorites_controller'
import viewListsController from '../controller/view_lists_controller'
import Shares from './share'
import Favorites from './favorite'
import Purchases from './purchase'
import VideoComponent from './video'
import "../styles/components/single_movie_view.scss"

/**
   * @param {*} props movie title movieImage movieUrl favoritesCount affiliateLink ip_address
   * @return {*}
   */
const SingleMovieView = (props) => {
  const [isPlaying, setPlaying] = useState(true)
  const [getMovie, setMovie] = useState(props.movie)
  const [isModalAfterViewing, openModalAfterViewing] = useState(false)
  const videoRef = useRef();
  const wrapVideoRef = useRef();

  useEffect(() => {
    if (props.isSelectCategoryMenu) {
      setPlaying(false)
      videoRef.current && videoRef.current.pause()
      } else {
      setPlaying(true)
      videoRef.current && videoRef.current.play()
    }
  }, [props.isSelectCategoryMenu])

  useEffect(() => {
    if (props.isSideMenu) {
      setPlaying(false)
      videoRef.current && videoRef.current.pause()
      } else {
      setPlaying(true)
      videoRef.current && videoRef.current.play()
    }
  }, [props.isSideMenu])

  /**
   * @param {*} movie //動画一覧
   */
  const postViewList = async (movie) => {
    await viewListsController.postViewList(movie.id, props.ip_address)
  }

  /**
   *
   * @param {*} movie いいねしたい動画
   * @param {*} e イベントハンドラ
   */
     const postFavorites = async (e) => {
      e.stopPropagation()
      let newFavorites = null
      if (getMovie.is_favorited) {
        newFavorites = await favoritesController.deleteFavorite(props.movie.id, props.ip_address)
      } else {
        newFavorites = await favoritesController.createFavorite(props.movie.id, props.ip_address)
      }
      const beforeMovie = getMovie
      const movie = {
        ...beforeMovie, 
        ...{is_favorited: newFavorites.is_favorited, 
        favorites_count: newFavorites.favorites_count
      }}
      setMovie(movie)
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
      postFavorites(e)
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
    <div className="wrapper_single_movie_view" id={"movie-url-" + props.movie.id}>
      {
        !isPlaying &&
        <div className="video_start_icon">
          <img src={VideoStartIcon} alt="" width={48} height={59}/>
        </div>
      }
      <div ref={observe}>
        <div className="empty_video" id={"video-player-" + props.movie.id} ref={wrapVideoRef} onTouchStart={(e) => toggleTappedProcess(e)}></div>
      </div>
      {
        !isModalAfterViewing &&
        <div className="wrapper_purchases_and_chares_btn">
          <Purchases
            movie={props.movie}
            title={props.title}
            affiliateLink={props.affiliateLink}
            ip_address={props.ip_address}
          />
          <div className="wrapper_video_options_btn">
            <Favorites 
              movie={getMovie}
              postFavorites={(e) => postFavorites(e)}
              ip_address={props.ip_address}
            />
            <div className="wrapper_share_btn">
              <Shares
                movie={props.movie}
                onToggle={props.toggleShareDrawer}
                ip_address={props.ip_address}
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