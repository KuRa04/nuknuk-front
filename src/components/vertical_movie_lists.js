import React, { useState, useEffect } from 'react';
import { Drawer, Button } from '@material-ui/core'
import {
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share'
import InfiniteScroll from 'react-infinite-scroller'
import CopyLink from '../images/clip.svg'
import { largeTabsMapping, largeTabsArray } from '../constant/tabs'
import sharesController from '../controller/shares_controller'
import moviesController from '../controller/movies_controller'
import SingleMovieView from "./single_movie_view"
import "../styles/components/vertical_movie_list.scss";

const VerticalMovieLists = (props) => {
  const [movieLists, setMovieLists] = useState([])
  const [pageCount, setPageCount] = useState(0)
  const [isShareDrawer, openShareDrawer] = useState(false)
  const [shareMovieId, setShareMovieId] = useState(0)
  const [hasMore, setHasMore] = useState(true);  //再読み込み判定

  //TODO useEffectにpropsの値を含める方法を調査
  useEffect(() => {
    const searchUrl = window.location.search
    const getMovies = async () => {
      const array = await moviesController.getMovieLists(props.smallTabValue, largeTabsArray[props.bigTabValue], null, 1, props.ip_address, searchUrl)
      setMovieLists(array)
    }
    getMovies()
  }, [props.bigTabValue, props.ip_address, props.smallTabValue])

  useEffect(() => {
    // 無限ループしない
    setPageCount(n => n + 1);
  }, [movieLists]);

  /**
   * @param {*} movieId シェアする動画のID
   */
  const toggleShareDrawer = (movieId) => {
    setShareMovieId(movieId)
    openShareDrawer(!isShareDrawer)
  }

  /**
   * @param {*} channelName シェアするチャネル名
   */
  const postShare = async (channelName) => {
    const movieId = shareMovieId
    if (channelName === 'copy') {
      // httpsでしか動かない
      navigator.clipboard.writeText(window.location.href + "?movie_id=" + movieId)
    }
    await sharesController.postShare(channelName, movieId)
  }

  const loadMore = async () => {
    const array = await moviesController.getMovieLists(props.smallTabValue, largeTabsMapping[props.bigTabValue], null, pageCount, props.ip_address, null)
    console.log(array)
    if (array.length < 1) {
      setHasMore(false)
      return
    }
    setMovieLists([...movieLists, ...array])
  }

  return  (
    <>
      <InfiniteScroll
        data-testid="episodes-infinite-scroll"
        loadMore={loadMore}
        hasMore={hasMore}
        initialLoad={false}
        loader={<div key={0}>ただいまロード中です</div>}
      >
        <div className="wrapper_vertical_movies">
          {
            movieLists.map((movie, index) =>{
              return <div key={index} className="wrapper_single_movie_view_component">
                <SingleMovieView
                movie={movie}
                title={movie.title}
                movieImage={movie.image}
                movieUrl={movie.movie_url}
                affiliateLink={movie.affiliate_link}
                ip_address={props.ip_address}
                toggleShareDrawer={toggleShareDrawer}
                isFavorited={movie.isFavorited}
                favoritesCount={movie.favorites_count}
                isSelectCategoryMenu={props.isSelectCategoryMenu}
                isSideMenu={props.isSideMenu}
                />
              </div>
            })
          }
        </div>
      </InfiniteScroll>
      <Drawer className="wrapper_share_drawer_box" anchor='bottom' open={isShareDrawer} onClick={() => openShareDrawer(!isShareDrawer)} >
        <p className="share_title">この動画をシェアする</p>
        <div className="share_drawer">
          <div className="share_icon">
            <img
              className="copy_link"
              alt=""
              src={CopyLink}
              onClick={() => postShare("copy")}
              width={50}
              height={50}
            />
            <p className="share_text">リンクをコピー</p>
          </div>
          <div className="share_icon">
            <TwitterShareButton onClick={() => postShare("twitter")} url={window.location.host + "?movie_id=" + shareMovieId}>
              <TwitterIcon size={50} round />
            </TwitterShareButton>
            <p className="share_text">Twitter</p>
          </div>
          <div className="share_icon">
            <LineShareButton onClick={() => postShare("line")} url={window.location.host + "?movie_id=" + shareMovieId}>
              <LineIcon size={50} round />
            </LineShareButton>
            <p className="share_text">LINE</p>
          </div>
        </div>
        <div className="share_footer">
          <Button className="cancel_button" onClick={() => openShareDrawer(!isShareDrawer)}>キャンセル</Button>
        </div>
      </Drawer>
    </>
  )
}

export default VerticalMovieLists