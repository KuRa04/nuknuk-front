import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'
import useInView from "react-cool-inview"
import SwipeableViews from 'react-swipeable-views';
import {AppBar, Tabs, Tab, Toolbar, Drawer, Box, List, ListItem, createTheme, ThemeProvider, Button, Modal} from '@material-ui/core'
import LogoWhite from '../images/logo_white_2.svg'
import CopyLink from '../images/clip.svg'
import SideImageWhite from '../images/side_menu_white.svg'
import SideImageBlack from '../images/side_menu_black.svg'
import VideoStartIcon from '../images/video_start.svg'
import SelectCategoryIcon from '../images/select_category.svg'
import BeforeFavoriteImg from '../images/before_favorite.svg'
import AfterFavoriteImg from '../images/after_favorite.svg'
import banImg from '../images/ban.svg'
import Shares from '../components/share'
import Purchases from '../components/purchase'
import VideoComponent from '../components/video'
import SelectGenre from './select_genre'
import {
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share'
import "../styles/pages/movies.scss";
import {categories} from '../constant/categories'
import sharesController from '../controller/shares_controller'
import favoritesController from '../controller/favorites_controller'
import viewListsController from '../controller/view_lists_controller'
import moviesController from '../controller/movies_controller'

const Movies = (props) => {
  // 状態変数
  const [movieLists, setMovieLists] = useState([])
  const [isSideMenu, openSideMenu] = useState(false)
  const [isSelectCategoryMenu, openSelectCategoryMenu] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [tabValueIndex, setTabValueIndex] = useState(0)
  const [categoryValue, setCategoryValue] = useState(0)
  const [isShareDrawer, openShareDrawer] = useState(false)
  const [shareMovieId, setShareMovieId] = useState(0)
  const [pageCount, setPageCount] = useState(0)

  //TODO useEffectにpropsの値を含める方法を調査
  useEffect(() => {
    const searchUrl = window.location.search
    const getMovies = async () => {
      const array = await moviesController.getMovieLists(-1, 'popular', null, 1, '', searchUrl)
      setMovieLists(array)
    }
    getMovies()
  }, [])

  useEffect(() => {
    // 無限ループしない
    setPageCount(n => n + 1);
  }, [movieLists]);

  /**
   * @param {*} value smallTabの値
   * @param {*} text smallTabの名称
   */
  const tabsChange = async (value, text) => {
    setPageCount(1)
    let largeTab = ''
    console.log(value)
    if (value === 0) {
      largeTab = 'popular'
    } else if (value === 1) {
      largeTab = 'genre'
      setCategoryValue(categories.indexOf(text))
    } else if (value === 13) {
      largeTab = 'new'
    }
    const array = await moviesController.getMovieLists(value - 1, largeTab, null, 1, props.ip_address, null)
    setMovieLists(array)
    setTabValue(value)
    setTabValueIndex(value)
  }

  const tabsChangeIndex = (value) => {
    setPageCount(1)
    switch (value) {
      case 0:
        setTabValue(value)
        setTabValueIndex(value)
        categoriesChange(value,categories[value])
        break;
      case 1:
        setTabValue(1)
        setTabValueIndex(value)
        categoriesChange(value,categories[value])
        break;
      case 12:
        setTabValue(1)
        setTabValueIndex(value)
        categoriesChange(value,categories[value])
        break;
      case 13:
        setTabValue(value)
        setTabValueIndex(value)
        break;
      default:
        setTabValueIndex(value)
        categoriesChange(value,categories[value])
        break;
    }
  }

  const categoriesChange = async (value, text) => {
    setPageCount(1)
    const array = await moviesController.getMovieLists(value - 1, 'genre', null, 1, props.ip_address, null)
    setMovieLists(array)
    if (value === 12) {
      setTabValue(13)
    }
    setCategoryValue(categories.indexOf(text))
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

  /**
   * @param {*} movieId シェアする動画のID
   */
  const toggleShareDrawer = (movieId) => {
    setShareMovieId(movieId)
    openShareDrawer(!isShareDrawer)
  }

  /**
   * @param {*} movie //動画一覧
   */
  const postViewList = async (movie) => {
    await viewListsController.postViewList(movie.id, props.ip_address)
  }

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

    const chooseBigTab = (tabValue) => {
      let largeTab = ''
      if (tabValue === 0)
        largeTab = 'popular'
      else if (tabValue === 1)
        largeTab = 'genre'
      else if (tabValue === 13)
        largeTab = 'new'
      return largeTab;
    }

    const getNextMovieLists = async () => {
      const array = await moviesController.getMovieLists(categoryValue, chooseBigTab(tabValue), null, pageCount, "", null)
      console.log(array)
      setMovieLists(movieLists.concat(array))
    }

    const { observe } = useInView({
      threshold: 1,
      onEnter: async ({ observe, unobserve }) => {
        unobserve()
        setPlaying(true)
        const movieId = wrapVideoRef.current.id.split('video-player-')[1]
        const movie = movieLists.filter((movie) => movie.id === Number(movieId))[0]
        if (movie === movieLists.slice(-1)[0]) {
          getNextMovieLists()
        }
        postViewList(props.movie)
        ReactDOM.render(
          <VideoComponent
            movie={movie}
            videoRef={videoRef}
            onEnded={() => openModalAfterViewing(!isModalAfterViewing)}
          />,
          document.getElementById("video-player-" + movieId)
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
                    onToggle={toggleShareDrawer}
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

  const theme = createTheme({
    status: {
      danger: '#e53e3e',
    },
    palette: {
      primary: {
        main: '#000000',
        darker: '#000000',
      },
      neutral: {
        main: '#64748B',
        contrastText: '#fff',
      },
    },
  });

  const VerticalMovieLists = (props) => {
    return  <div className="movies">
    {
      movieLists.map((movie, index) =>{
        return <div key={index} className="movie_list">
          <SingleMovieView
            movie={movie}
            title={movie.title}
            movieImage={movie.image}
            movieUrl={movie.movie_url}
            favoritesCount={movie.favorites_count}
            affiliateLink={movie.affiliate_link}
            ip_address={props.ip_address}
            />
        </div>
      })
    }
    </div>
  }

  const smallTabs = categories.slice(1, categories.length - 1)

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <div className="main">
          <Box sx={{height: 50}}>
            <AppBar
              style={{
                background: 'transparent', // AppBarの背景色を透明にする
                boxShadow: 'none'　// ボックスシャドウを削除
              }}
              position="fixed"
            >
              <Toolbar>
                <div className="tool_bar">
                  <img src={LogoWhite} alt=""/>
                  <img src={SelectCategoryIcon} alt="" width={30} height={30} onClick={() => openSelectCategoryMenu(!isSelectCategoryMenu)} />
                </div>
              </Toolbar>
              <img className="menu_icon" src={isSideMenu ? SideImageBlack : SideImageWhite} alt='menu' width={35} height={35} onClick={() => openSideMenu(!isSideMenu)} />
              <Tabs
                value={tabValue} // 0人気 1新着
                onChange={() => tabsChange}
                TabIndicatorProps={{style: {background:'#EFE060', height: "2.8px", borderRadius: "8%"
              }}}
                centered
              >
                <Tab label="人気" style={{color: "#F0F0F0", fontSize: '17px', paddingLeft: "0px", paddingRight: "0px", marginLeft: "12px", marginRight: "12px", }} onClick={() => tabsChange(0, '人気')} />
                <Tab label="ジャンル別" style={{color: "#F0F0F0", fontSize: '17px', paddingBottom: "2.5px", paddingLeft: "0px", paddingRight: "0px", marginLeft: "12px", marginRight: "12px"}} onClick={() => tabsChange(1, '素人')} />
                <Tab label="おすすめ" style={{color: "#F0F0F0", fontSize: '17px', paddingBottom: "2.5px", paddingLeft: "0px", paddingRight: "0px", marginLeft: "12px", marginRight: "12px"}} value={13} onClick={() => tabsChange(13, 'おすすめ')}  />
              </Tabs>
                { tabValue === 1 &&
                  <Tabs
                    value={categoryValue} // tabValue ⇨ categoryValueに変更
                    onChange={() => categoriesChange}
                    variant='scrollable'
                    TabIndicatorProps={{style: {display: "none"}}}
                  >
                    {/* <Tab value={0} /> */}
                    {
                      smallTabs.map((category, index) => {
                        return <Tab
                          label={category}
                          value={index + 1}
                          key={'category-' + index + 1}
                          className={categoryValue === index + 1 ? "select_small_tab" : 'un_select_small_tab'}
                          onClick={() => categoriesChange(index + 1, category)}
                        />
                      }) }
                  </Tabs>
                }
              </AppBar>
          </Box>
          <SwipeableViews index={tabValueIndex} onChangeIndex={tabsChangeIndex}>
            <div id= {"junre-movie-0"}>
              {tabValueIndex === 0 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-1"}>
              { tabValueIndex === 1 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-2"}>
              { tabValueIndex === 2 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-3"}>
              { tabValueIndex === 3 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-4"}>
              { tabValueIndex === 4 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-5"}>
              { tabValueIndex === 5 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-6"}>
              { tabValueIndex === 6 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-7"}>
              { tabValueIndex === 7 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-8"}>
              { tabValueIndex === 8 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-9"}>
              { tabValueIndex === 9 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-10"}>
              { tabValueIndex === 10 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-11"}>
              { tabValueIndex === 11 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-12"}>
              { tabValueIndex === 12 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
            <div id= {"junre-movie-13"}>
              {tabValueIndex === 13 &&
                <VerticalMovieLists ip_address = {props.ip_address} />
              }
            </div>
          </SwipeableViews>
          <Drawer className="share_drawer_box" anchor='bottom' open={isShareDrawer} onClick={() => openShareDrawer(!isShareDrawer)} >
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
                <TwitterShareButton onClick={() => postShare("twitter")} url={"https://nuknuk-front-01.herokuapp.com?movie_id=" + shareMovieId}>
                  <TwitterIcon size={50} round />
                </TwitterShareButton>
                <p className="share_text">Twitter</p>
              </div>
              <div className="share_icon">
                <LineShareButton onClick={() => postShare("line")} url={"https://nuknuk-front-01.herokuapp.com?movie_id=" + shareMovieId}>
                  <LineIcon size={50} round />
                </LineShareButton>
                <p className="share_text">LINE</p>
              </div>
            </div>
            <div className="share_footer">
              <Button className="cancel_button" onClick={() => openShareDrawer(false)}>キャンセル</Button>
            </div>
          </Drawer>

          {/* サイドバー */}
          <Drawer anchor= 'left' open={isSideMenu} onClick={() => openSideMenu(!isSideMenu)} >
            <Box className="sidebar" width="215px">
              <List style={{fontSize: "12px", fontWeight: "bold", fontFamily: "Hiragino Sans"}}>
                <ListItem style={{height: "98px"}}></ListItem>
                <img className="menu_icon" src={SideImageBlack} alt=""/>
                <ListItem>当サイトについて</ListItem>
                <ListItem>プライバシーポリシー</ListItem>
                <ListItem>免責事項</ListItem>
                <ListItem>安心安全の理由</ListItem>
                <ListItem>お問い合わせ</ListItem>
                <img src={banImg} width={200} height={130} alt=""/>
              </List>
            </Box>
          </Drawer>

        <footer className="footer">
        </footer>
      </div>
      </ThemeProvider>
      <Modal open={isSelectCategoryMenu}>
        <SelectGenre ip_address={props.ip_address} closeSelectGenreMenu={() => props.displayLottie()} />
      </Modal>
    </React.Fragment>
  );
}

export default Movies
