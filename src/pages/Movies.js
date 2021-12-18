import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom'
import useInView from "react-cool-inview"
import axios from 'axios';
import SwipeableViews from 'react-swipeable-views';
import {AppBar, Tabs, Tab, Toolbar, Drawer, Box, List, ListItem, createTheme, ThemeProvider, Button} from '@material-ui/core'
import LogoWhite from '../images/logo_white_2.svg'
import CopyLink from '../images/clip.svg'
import SideImageWhite from '../images/side_menu_white.svg'
import SideImageBlack from '../images/side_menu_black.svg'
import VideoStartIcon from '../images/video_start.svg'
import SelectCategoryIcon from '../images/select_category.svg'
import BeforeFavoriteImg from '../images/before_favorite.svg'
import AfterFavoriteImg from '../images/after_favorite.svg'
import Shares from '../components/share'
import Purchases from '../components/purchase'
import RequestMovie from './api/axios'
import VideoComponent from '../components/video';
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
  const [tabValue, setTabValue] = useState(0)
  const [tabValueIndex, setTabValueIndex] = useState(0)
  const [categoryValue, setCategoryValue] = useState(0)
  const [shareDrawer, setShareDrawer] = useState(false)
  const [shareMovieId, setShareMovieId] = useState(0)
  const [count, setCount] = useState(props.movie_favorites_count)
  const [isLiked, setLiked] = useState(props.isLiked)
  const [pageCount, setPageCount] = useState(0)
  // const [shareCount, setShareCount] = useState(0)

  const categories = [
    "人気",
    "素人",
    "巨乳・美乳",
    "制服（JK、ナース他）",
    "人妻・若妻",
    "ハメ撮り",
    "スレンダー",
    "美少女",
    "お姉さん",
    "複数人",
    "ナンパ",
    "女子大生",
    "盗撮・のぞき",
    "おすすめ"
  ];

  // dbのパス
  // const dbUrl = process.env.REACT_APP_HEROKU_DB_URL
  const dbUrl = process.env.REACT_APP_LOCAL_DB_URL
  let tapCount = 0;

  const postFavorites = async (movie, e) => {
    e.stopPropagation()
    const favorites_db = dbUrl + '/favorites'
    if (isLiked) {
      console.log(props.ip_address)
      const params = {movie_id: movie.id, ip_address: props.ip_address}
      console.log(params)
      axios.delete(favorites_db, {data: params}).then((res) => {
        console.log(res.data)
        const isBool = !isLiked
        setLiked(isBool)
        const new_count = res.data.movie_favorites_count
        setCount(new_count)
        console.log(new_count)
      }).catch((res) => {
        console.log(res)
      })
    }else {
      console.log(dbUrl)
      axios.post(favorites_db, {movie_id: movie.id, ip_address: props.ip_address}).then((res) => {
        console.log(res.data)
        const isBool = !isLiked
        setLiked(isBool)
        const new_count = res.data.movie_favorites_count
        setCount(new_count)
        console.log(new_count)
      }).catch((res) => {
        console.log(res)
      })
    }
  }

  useEffect(() => {
    // 無限ループしない
    setPageCount(n => n + 1);
  }, [movies]);

  useEffect(() => {
    setCount(count)
  }, [count])

  useEffect(() => {
    setLiked(isLiked)
  }, [isLiked])

  useEffect( () => {
    const searchUrl = window.location.search
    let getDbUrl = dbUrl
    getDbUrl += searchUrl ? "/movies" + searchUrl : "/movies"
    const param = new RequestMovie(-1, 'new', null, 1, "")
    console.log(param)
    axios.get(getDbUrl, {params: param}).then((res) => {
      const array = res.data.movies;
      console.log(array)
      setMovie(array)
    }).catch((res) => {
      console.log(res)
    })
  }, [dbUrl]);

  // 0人気 1新着
  const tabsChange = (value, text) => {
    setPageCount(1)
    let param = new RequestMovie(value, null, null, 1, "")
    if (value === 0)
      param.largeTab = 'popular'
    else if (value === 1)
    {
      param.largeTab = 'genre'
      setCategoryValue(categories.indexOf(text))
    }
    else if (value === 13)
      param.largeTab = 'new'
    axios.get(dbUrl + '/movies', {params: param}).then((res) => {
    console.log(res.data.movies)
    const array = res.data.movies;
    setMovie(array)
    setTabValue(value)
    console.log(value)
    }).catch((res) => {
      console.log(res)
    })
  }

  const tabsChangeIndex = (value) => {
    setPageCount(1)
    console.log(value)
    switch(value) {
      case 0:
        setTabValue(value)
        setTabValueIndex(value)
        categoriesChange(0,"人気")
        console.log("人気")
        break;
      case 1:
        setTabValue(value)
        setTabValueIndex(value)
        categoriesChange(1,"素人")
        console.log("ジャンル別")
        break;
      case 12:
        setTabValue(1)
        setTabValueIndex(value)
        break;
      case 13:
        setTabValue(value)
        setTabValueIndex(value)
        break;
      default:
        setTabValueIndex(value)
        break
    }
  }

  const categoriesChange = (value, text) => {
    setPageCount(1)
    let param = new RequestMovie(value - 1, 'genre', null, 1, "")
    console.log(param)
    axios.get(dbUrl + '/movies', {params: param}).then((res) => {
      const array = res.data.movies;
      console.log(array)
      setMovie(array)
      // if (value === 1)
        // setTabValue(0)
      if (value === 12)
        setTabValue(13)
      setCategoryValue(categories.indexOf(text))
    }).catch((res) => {
      console.log(res)
    })
  }

  const postShare = (channelName) => {
    const movieId = shareMovieId
    if (channelName === 'copy'){
      // httpsでしか動かない
      navigator.clipboard.writeText(window.location.href + "?movie_id=" + movieId)
    }
    axios.post(dbUrl + '/shares', {
      channel: channelName,
      movie_id: movieId,
    }).then((res) => {
      console.log(res.data)
    }).catch((data) => {
      console.log(data)
    })
  }

  const toggleShareDrawer = (movie_id) => {
    setShareMovieId(movie_id)
    setShareDrawer(!shareDrawer)
  }

  const MovieComponent = (props) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const videoRef = useRef();
    const divRef = useRef();

    const playVideo = (e) => {
      if(!tapCount) {
        ++tapCount;
        console.log( "シングルタップに成功しました!!" );
        setTimeout(() => {
          if (tapCount === 1)
          {
            if(!isPlaying) {
              videoRef.current && videoRef.current.play();
              setIsPlaying(true);
            } else {
              videoRef.current && videoRef.current.pause();
              setIsPlaying(false);
            }
          }
          tapCount = 0;
        }, 500)
      }
      else {
        e.preventDefault();
        postFavorites(props.movie, e)
        console.log( "ダブルタップに成功しました!!" );
        tapCount = 0 ;
      }
    }

    const { observe } = useInView({
      threshold: 1,
      onEnter: ({ observe, unobserve }) => {
        let largeTab = ''
        unobserve();
        console.log("onEnter")
        const movieId = divRef.current.id.split('video-player-')[1]
        const movie = movies.filter((movie) => movie.id === Number(movieId))[0]
        console.log(movie)
        if (movie === movies.slice(-1)[0]) //movies.slice(-1)[0] 配列のlastの内容
        {
          console.log("これで最後です！")
          //pageの数値は可変に出来るようにする
          //large,smallタブのどこにいるのかを代入する
          if (tabValue === 0)
            largeTab = 'popular'
          else if (tabValue === 1)
            largeTab = 'genre'
          else if (tabValue === 13)
            largeTab = 'new'
          console.log(pageCount)
          let param = new RequestMovie(categoryValue, largeTab, null, pageCount, "")
          axios.get(dbUrl + '/movies', {params: param}).then((res) => {
            const array = res.data.movies;
            console.log(array)
            setMovie(movies.concat(array)) //arrayに入った動画が30未満だったら最後の動画を探すようにする
          }).catch((res) => {
            console.log(res)
          })
        }
        ReactDOM.render(<VideoComponent movie={movie} videoRef={videoRef}/>, document.getElementById("video-player-" + movieId));
        videoRef.current && videoRef.current.play();
        observe();
      },
      onLeave: ({ observe, unobserve }) => {
        unobserve();
        console.log("onLeave")
        videoRef.current.currentTime = 0
        const movieId = divRef.current.id.split('video-player-')[1]
        let movie = document.getElementById("video-player-" + movieId).replaceChildren;
        movie = null;
        console.log(movie)
        observe();
      },
    });
    return (
      <div className="wrapper_movie" id={"movie-url-" + props.movie.id} onTouchStart={(e) => playVideo(e)}>
        {
          isPlaying &&
          <div className="video_start_icon">
            <img src={VideoStartIcon} alt="" width={48} height={59}/>
          </div>
        }
          <div ref={observe}>
            <div className="empty_component" id={"video-player-" + props.movie.id} ref={divRef}></div>
          </div>
        <div className="movie_object">
          <div className="styles.wrapper_title">
            <p className="movie_title">{props.movie.title}</p>
            <Purchases
              movie={props.movie}
              ip_address={props.ip_address}
            />
            </div>
            <div className="video_btn">
            <div className="wrapper_favorites">
              <img onClick={(e) => postFavorites(props.movie, e)} alt="" width="35" height="35" src={isLiked ? AfterFavoriteImg : BeforeFavoriteImg}  />
              <span className="favorites_count">{1}</span>
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

  const smallTabs = categories.slice(1, categories.length -1)

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
                <img src={SelectCategoryIcon} alt="" width={30} height={30} />
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
                  {
                    smallTabs.map((category, index) => {
                      return <Tab
                        label={category}
                        value={++index}
                        key={'category-' + index}
                        className={categoryValue === index ? "select_small_tab" : 'un_select_small_tab'}
                        onClick={() => categoriesChange(index, category)}
                      />
                    }) }
                </Tabs>
              }
            </AppBar>
        </Box>
        <SwipeableViews index={tabValueIndex} onChangeIndex={tabsChangeIndex}>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
          <div className="movies">
            {
              movies.map((movie, index) =>{
                return <div key={index} className="movie_list">
                  <MovieComponent
                    index={index}
                    movie={movie}
                    title={movie.title}
                    movieImage={movie.image}
                    movieUrl={movie.movie_url}
                    affiliateLink={movie.affiliate_link}
                    ip_address={props.ip_address}
                    dbUrl={props.dbUrl}
                    />
                </div>
              })
            }
          </div>
        </SwipeableViews>
        <Drawer className="share_drawer_box" anchor='bottom' open={shareDrawer} onClick={() => setShareDrawer(!shareDrawer)} >
          <p className="share_title">シェア：</p>
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
            <Button className="cancel_button" onClick={() => setShareDrawer(false)}>キャンセル</Button>
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
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default Movies
