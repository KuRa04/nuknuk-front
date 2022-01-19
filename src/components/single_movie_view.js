import React, { useState, useEffect, useRef, useCallback } from 'react';
import useInView from "react-cool-inview"
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
  const [funcPostViewList, setPostViewList] = useState(null)
  // const [isStopVideoByModal, setStopVideoByModal] = useState(false)
  const videoRef = useRef();
  const wrapVideoRef = useRef();

  const togglePlayVideo = useCallback(() => {
    console.log("aaa")
    if (isPlaying) {
      // chancelPostViewList() // 一旦コメントアウト
      videoRef.current && videoRef.current.pause()
    }
  },[isPlaying])

  useEffect(() => {
    if (props.isSelectCategoryMenu) {
      togglePlayVideo()
    }
  }, [togglePlayVideo, isPlaying, props.isSelectCategoryMenu])

  useEffect(() => {
    if (props.isSideMenu) {
      togglePlayVideo()
    }
  }, [isPlaying, props.isSideMenu, togglePlayVideo])

  /**
   * @param {*} movie //動画一覧
   */
  const postViewList = () => {
    viewListsController.postViewList(props.movie.id, props.ip_address)
  }

  /**
   * viewListのpostを5秒後に設定
   */
  const afterPostViewList = () => {
    setPostViewList(setTimeout(() => {
      postViewList()
    }, 5000))
  }

  /**
   * 5秒以内に別動画へ移動したらpostの設定を削除
   */
  const chancelPostViewList = () => {
    clearTimeout(funcPostViewList)
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
    if (!tapCount) {
      ++tapCount
      setTimeout(() => {
        if (!isPlaying && !!tapCount) {
          openModalAfterViewing(false);
          videoRef.current && videoRef.current.play()
          setPlaying(true)
        } else if (isPlaying && !!tapCount) {
          videoRef.current && videoRef.current.pause()
          setPlaying(false)
        }
        tapCount = 0
      }, 350)
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
      videoRef.current.children[0].src = props.movie.movie_url + '#t=3'
      try {
        videoRef.current.load()
      } catch (error) {
        console.log(error)
      }
      setPlaying(true)
      afterPostViewList()
      observe()
    },
    onLeave: ({ observe, unobserve }) => {
      unobserve()
      openModalAfterViewing();
      chancelPostViewList()
      videoRef.current && videoRef.current.pause()
      videoRef.current.currentTime = 0
      videoRef.current.children[0].src = ''
      videoRef.current.load()
      observe()
    },
  })

  return (
    <div className="wrapper_single_movie_view" id={"movie-url-" + props.movie.id}>
      <div ref={observe}>  
        <div className={isModalAfterViewing ? "wrapper_video_shadow" : "wrapper_video"} id={"video-player-" + props.movie.id} ref={wrapVideoRef} onTouchEnd={toggleTappedProcess}>
          <VideoComponent
            movie={props.movie}
            videoRef={videoRef}
            onEnded={() => openModalAfterViewing(!isModalAfterViewing)}
          />
           {
            !isPlaying &&
              <div className="video_start_icon">
                <img src={VideoStartIcon} alt="" width={48} height={59}/>
              </div>
            }
        </div>
        {
        isModalAfterViewing ?
        <div className="after_movie_modal">
          <Purchases
            movie={props.movie}
            title={props.title}
            affiliateLink={props.affiliateLink}
            ip_address={props.ip_address}
          />
          <div className="replay_text" onTouchStart={() => replayVideo()}>リプレイ</div>
       </div>
        :
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
      </div>
      {/* <Modal 
        open={isModalAfterViewing} 
        onClose={() => replayVideo()}
        BackdropComponent={Backdrop}
        style={
          {
            display:'flex', 
            alignItems:'center', 
            justifyContent:'center'
          }
        }
      >
        <div className="after_movie_modal">
          <Purchases
            movie={props.movie}
            title={props.title}
            affiliateLink={props.affiliateLink}
            ip_address={props.ip_address}
          />
          <div className="replay_text" onTouchStart={() => replayVideo()}>リプレイ</div>
        </div>
      </Modal> */}
    </div>
  )
}

export default SingleMovieView