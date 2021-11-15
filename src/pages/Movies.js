import React, { useState, useEffect, useRef } from "react"
import useInView from "react-cool-inview"
import SwipeableViews from 'react-swipeable-views';
import axios from 'axios'
import {AppBar, Tabs, Tab, Toolbar, Drawer, Box, List, ListItem, createTheme, ThemeProvider, Button} from '@material-ui/core'
import LogoWhite from '../images/logo_white_2.svg'
import ShareButton from '../images/share.svg'
import CopyLink from '../images/clip.svg'
import SideImageWhite from '../images/side_menu_white.svg'
import SideImageBlack from '../images/side_menu_black.svg'
import Likes from '../components/like'
import Purchases from '../components/purchase'
import {
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share'
import "../styles/pages/movies.scss";

const Movies = (props) => {
  // 状態変数
  const [movies, setMovie] = useState([])
  const [isSideMenu, openSideMenu] = useState(false)
  const [tabValue, setTabValue] = useState(1)
  const [tabValueIndex, setTabValueIndex] = useState(1)
  const [categoryValue, setCategoryValue] = useState(0)
  const [shareDrawer, setShareDrawer] = useState(false)
  const [shareMovieId, setShareMovieId] = useState(0)

  const categories = [
    "巨乳",
    "素人",
    "ナンパ",
    "ギャル",
    "3P",
    "OL",
    "マッサージ",
    "人妻",
    "寝取り寝取られ",
    "ハメ撮り",
    "乱行",
    "JK",
    "スレンダー",
    "ハーフ"];

  // dbのパス
  // const db_url = Rails.env === 'development' ? DB_LOCAL_URL : DB_PRODUCTION_URL
  const db_url = props.db_url

  useEffect( () => {
    const param = window.location.search
    let get_db_url = db_url
    get_db_url += param ? "/movies" + param : "/movies"
    console.log(get_db_url)
    axios.get(get_db_url).then((res) => {
    console.log(res.data.movies)
    const array = res.data.movies.slice(0,10);
    console.log(array)
    setMovie(array)
    }).catch((res) => {
      console.log(res)
    })
  }, [db_url]);

  // 0人気 1新着
  const tabsChange = (value) => {
    switch(value) {
      case 0:
        axios.get(db_url + '/movies').then((res) => {
          console.log(res.data.movies)
          const array = res.data.movies.slice(0,10);
          setMovie(array)
          setTabValue(value)
          console.log("人気")
        }).catch((res) => {
          console.log(res)
        })
        break;
      case 1:
        axios.get(db_url + '/movies').then((res) => {
          console.log(res.data.movies)
          const array = res.data.movies.slice(0,10);
          setMovie(array)
          setTabValue(value)
          console.log("ジャンル別")
        }).catch((res) => {
          console.log(res)
        })
        break;
      case 2:
        axios.get(db_url + '/movies').then((res) => {
          console.log(res.data.movies)
          const array = res.data.movies.slice(0,10);
          setMovie(array)
          setTabValue(value)
          console.log("新着")
        }).catch((res) => {
          console.log(res)
        })
        break;
      default:
        console.log("どれにも属していません")
    }
  }

  const tabsChangeIndex = (value) => {
    switch(value) {
      case 0:
        setTabValue(value)
        setTabValueIndex(value)
        console.log("人気")
        break;
      case 1:
        setTabValue(value)
        setTabValueIndex(value)
        console.log("ジャンル別")
        break;
      case 2:
        setTabValue(value)
        setTabValueIndex(value)
        console.log("新着")
        break;
      default:
        console.log("どれにも属していません")
    }
  }

  const categoriesChange = (value) => {
    axios.get(db_url + '/movies?tab_value=' + value).then((res) => {
      console.log(res.data.movies)
      const array = res.data.movies.slice(0,10);
      console.log(array)
      console.log(db_url + '/popular_movies?tab_value=' + value)
      setMovie(array)
      setCategoryValue(value)
    }).catch((res) => {
      console.log(res)
    })
  }

  const postShare = (channelName) => {
    const movieId = shareMovieId
    if (channelName === 'copy'){
      // httpsでしか動かない
      navigator.clipboard.writeText(window.location.href)
    }
    axios.post(db_url + '/shares', {
      channel: channelName,
      movie_id: movieId,
    }).then((res) => {
      console.log(res.data)
    }).catch((data) => {
      console.log(data)
    })
  }

  const toggleFavorites = (movie_ip_address) => {
    console.log(movie_ip_address.includes(props.ip_address))
    return props.ip_address && movie_ip_address.includes(props.ip_address)
  }

  const toggleShareDrawer = (movie_id) => {
    setShareMovieId(movie_id)
    setShareDrawer(!shareDrawer)
  }

  const MovieComponent = (props) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const videoRef = useRef();

    const playVideo = (e) => {
      if(!isPlaying) {
        videoRef.current && videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current && videoRef.current.pause();
        setIsPlaying(false);
      }
    }

    const { observe } = useInView({
      threshold: 1,
      onEnter: ({ observe, unobserve }) => {
        //viewportに入ったらvideoをスタート
        unobserve();
        videoRef.current && videoRef.current.play();
        setIsPlaying(true);
        console.log("onEnter")
        observe();
        // if(video.ended()) {
        //   //ここに動画終了後の処理を記述
        //   //今は最初から動画を流す設定
        //   video.play();
        // }

      },
      onLeave: ({ observe, unobserve }) => {
        //viewportから出たらvideoを止める
        unobserve();
        videoRef.current.currentTime = 0; //videoの再生時間を最初に戻す
        videoRef.current && videoRef.current.pause();
        setIsPlaying(false);
        console.log("onLeave")
        observe();
      },
    });
    return (
      <div className="wrapper-movie" id={"movie-url-" + props.movie.id} onClick={() => playVideo()}>
        <div ref={observe}>
          <video
            muted
            controls={false}
            playsInline
            width="370"
            height="300"
            poster={props.movieImage}
            src={props.movieUrl}
            id={'movie-list-' + props.index}
            preload="metadata"
            ref={videoRef}
          >
          </video>
        </div>
        <div className="movie-object">
          <div className="wrapper-title">
            <p className="movie-title">{props.title}</p>
            <Purchases
              movie={props.movie}
              affiliateLink={props.affiliateLink}
              db_url={db_url}
              movie_purchases_count={props.movie_purchases_count}
            />
            </div>
            <div className="video-btn">
              <Likes
                movie={props.movie}
                db_url={db_url}
                ip_address={props.ip_address}
                isLiked={toggleFavorites(props.movie.favorite_ip_address)}
                movie_favorites_count={props.movie.favorites_count}
              />
              <div className="share-btn">
                {/* シェアボタンを表示、クリックで各SNSのボタンが表示される */}
                <img alt="" width="35" height="35" src={ShareButton} onClick={() => toggleShareDrawer(props.movie.id)} />
                <span className="favorites-count">{props.movie.shared_movies_count}</span>
              </div>
            </div>
          </div>
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

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <Box sx={{height: 50}}>
          <AppBar
            style={{
              background: 'transparent', // AppBarの背景色を透明にする
              boxShadow: 'none'　// ボックスシャドウを削除
            }}
            position="fixed"
          >
            <Toolbar>
              <div className="tool-bar">
                <img src={LogoWhite} alt=""/>
                <img
                  alt=""
                  className="menu-icon"
                  src={isSideMenu ? SideImageBlack : SideImageWhite}
                  onClick={() => openSideMenu(!isSideMenu)}
                />
              </div>
            </Toolbar>
            <Tabs
              value={tabValue} // 0人気 1新着
              onChange={() => tabsChange}
              TabIndicatorProps={{style: {background:'yellow'
            }}}
              centered
            >
              <Tab label="人気" style={{color: "white", fontSize: '17px'}} onClick={() => tabsChange(0)} />
              <Tab label="ジャンル別" style={{color: "white", fontSize: '17px'}} onClick={() => tabsChange(1)} />
              <Tab label="おすすめ" style={{color: "white", fontSize: '17px'}} onClick={() => tabsChange(2)} />
            </Tabs>
            { tabValue === 1 ?
                <>
            <Tabs
              value={categoryValue} // 0人気 1新着
              onChange={() => categoriesChange}
              variant='scrollable'
              TabIndicatorProps={{style: {display: "none"}}}
              centered
            >
              <Tab label="巨乳" style={{color: "white", fontSize: '17px'}} onClick={() => categoriesChange(0)} />
              <Tab label="素人" style={{color: "white", fontSize: '17px'}} onClick={() => categoriesChange(1)} />
              <Tab label="ナンパ" style={{color: "white", fontSize: '17px'}} onClick={() => categoriesChange(2)} />
              <Tab label="ギャル" style={{color: "white", fontSize: '17px'}} onClick={() => categoriesChange(3)} />
              <Tab label="OL" style={{color: "white", fontSize: '17px'}} onClick={() => categoriesChange(5)} />
              <Tab label="人妻" style={{color: "white", fontSize: '17px'}} onClick={() => categoriesChange(7)} />
              <Tab label="ハメ撮り" style={{color: "white", fontSize: '17px'}} onClick={() => categoriesChange(9)} />
              <Tab label="スレンダー" style={{color: "white", fontSize: '17px'}} onClick={() => categoriesChange(12)} />
            </Tabs>
              </>
                :
                <></>
              }
            {/* <ul className="wrapper-category">
              { tabValue === 1 ?
                <>
                  {
                    categories.map((category,index) => {
                      return (
                        <li className="category-list current" key={index} onClick={() => categoriesChange(index)}>{category}</li>
                        // <Tab key={index} label={category} style={{color: "white"}} onClick={() => categoriesChange(index)} />
                      )
                    })
                  }
                </>
                :
                <></>
              }
            </ul> */}
          </AppBar>
        </Box>
        <div>
          <SwipeableViews index={tabValueIndex} onChangeIndex={tabsChangeIndex}>
            <div className="movies">
              {
                movies.map((movie, index) =>{
                  return <div key={index} className={'movie-list'}>
                    <MovieComponent
                      index={index}
                      movie={movie}
                      title={movie.title}
                      movieImage={movie.image}
                      movieUrl={movie.movie_url}
                      affiliateLink={movie.affiliate_link}
                      ip_address={props.ip_address}
                      />
                  </div>
                })
              }
            </div>
            <div className="movies">
              {
                movies.map((movie, index) =>{
                  return <div key={index} className={'movie-list'}>
                    <MovieComponent
                      index={index}
                      movie={movie}
                      title={movie.title}
                      movieImage={movie.image}
                      movieUrl={movie.movie_url}
                      affiliateLink={movie.affiliate_link}
                      ip_address={props.ip_address}
                      />
                  </div>
                })
              }
            </div>
            <div className="movies">
              {
                movies.map((movie, index) =>{
                  return <div key={index} className={'movie-list'}>
                    <MovieComponent
                      index={index}
                      movie={movie}
                      title={movie.title}
                      movieImage={movie.image}
                      movieUrl={movie.movie_url}
                      affiliateLink={movie.affiliate_link}
                      ip_address={props.ip_address}
                      />
                  </div>
                })
              }
            </div>
          </SwipeableViews>
        </div>
        {/* シェア */}
        <Drawer className="share-drawer-box" anchor='bottom' open={shareDrawer} onClick={() => setShareDrawer(!shareDrawer)} >
          <p className="share-title">シェア：</p>
          <div className="share-drawer">
            <div className="share-icon">
              <img
                className="copy-link"
                alt=""
                src={CopyLink}
                onClick={() => postShare("copy")}
              />
              <p className="share-text">リンクをコピー</p>
            </div>
            <div className="share-icon">
              <TwitterShareButton onClick={() => postShare("twitter")} url={"https://nuknuk-front-01.herokuapp.com?movie_id=" + shareMovieId}>
                  <TwitterIcon size={50} round />
              </TwitterShareButton>
              <p className="share-text">Twitter</p>
            </div>
            <div className="share-icon">
              <LineShareButton onClick={() => postShare("line")} url={"https://nuknuk-front-01.herokuapp.com?movie_id=" + shareMovieId}>
                <LineIcon size={50} round />
              </LineShareButton>
              <p className="share-text">LINE</p>
            </div>
          </div>
          <div className="share-footer">
            <Button className="cancel-button" onClick={() => setShareDrawer(false)}>キャンセル</Button>
          </div>
        </Drawer>

        {/* サイドバー */}
        <Drawer anchor= 'left' open={isSideMenu} onClick={() => openSideMenu(!isSideMenu)} >
          <Box className="sidebar" width="150px">
            <List>
              <ListItem>サイトポリシー</ListItem>
              <ListItem>お問い合わせ</ListItem>
            </List>
          </Box>
        </Drawer>

        <footer className="footer">
          
        </footer>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default Movies
