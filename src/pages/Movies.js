import React, { useState, useEffect } from "react"
import axios from 'axios'
import {AppBar, Tabs, Tab, Toolbar, Drawer, Box, List, ListItem, Avatar, createTheme, ThemeProvider, Button} from '@material-ui/core'
import LogoWhite from '../images/logo_white.png'
import ShareButton from '../images/share.png'
import CopyLink from '../images/copy_link.svg'
import SideImageWhite from '../images/side_menu.png'
import SideImageBlack from '../images/side_menu_black.png'
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
  const [shareDrawer, setShareDrawer] = useState(false)
  const [shareMovieId, setShareMovieId] = useState(0)

  const categories =　[
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
    axios.get(db_url + '/movies').then((res) => {
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
    if (value === 0) {
      axios.get(db_url + '/movies').then((res) => {
        console.log(res.data.movies)
        setMovie(res.data.movies)
        setTabValue(0)
      }).catch((res) => {
        console.log(res)
      })
    }else {
      axios.get(db_url + '/movies').then((res) => {
        console.log(res.data.movies)
        setMovie(res.data.movies)
        setTabValue(1)
      }).catch((res) => {
        console.log(res)
      })
    }
  }

  const categoriesChange = (value) => {
    axios.get(db_url + '/movies?tab_value=' + value).then((res) => {
      console.log(res.data.movies)
      const array = res.data.movies.slice(0,10);
      console.log(array)
      console.log(db_url + '/popular_movies?tab_value=' + value)
      setMovie(array)
    }).catch((res) => {
      console.log(res)
    })
  }


  // const switchStopPlaying = (index) => {
  //   console.log("aaa")
  //   let video = document.getElementById("movie-list-" + index);
  //   if(video.paused) {
  //     video.play()
  //   }else {
  //     video.pause();
  //   }
  // }

  const postShare = (channelName) => {
    const movieId = shareMovieId
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

    return (
      <div className="wrapper-movie">
        <video
          muted
          controls={false}
          playsInline
          width="370"
          height="600"
          poster={props.movieImage}
          src={props.movieUrl}
          id={'movie-list-' + props.index}
          preload="metadata"
        >
        </video>
        <p className="movie-title">{props.movieTitle}</p>
        <Purchases
          movie={props.movie}
          affiliateLink={props.affiliateLink}
          db_url={db_url}
          movie_purchases_count={props.movie_purchases_count}
        />
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
            <img alt="" width="50" height="50" src={ShareButton} onClick={() => toggleShareDrawer(props.movie.id)} />
            <span className="favorites-count">{10}</span>
          </div>
        </div>
      </div>
    )
  }

  const InviewComponent =  (props) => {
    // let video = document.getElementById("movie-list-" + props.index);

    return (
      <MovieComponent
        movie={props.movie}
        movieTitle={props.title}
        index={props.index}
        movieImage={props.movieImage}
        movieUrl={props.movieUrl}
        affiliateLink={props.affiliateLink}
        ip_address={props.ip_address}
        />
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
              <div><img src={LogoWhite} alt=""/></div>
            </Toolbar>
            <Tabs
              value={tabValue} // 0人気 1新着
              onChange={() => tabsChange}
              TabIndicatorProps={{style: {display: "none"}}}
              centered
            >
              <Tab label="人気" style={{color: "white"}} onClick={() => tabsChange(0)} />
              <Tab label="新着" style={{color: "white"}} onClick={() => tabsChange(1)} />
            </Tabs>
          </AppBar>
        </Box>
        <ul className="wrapper-category">
        {
          categories.map((category,index) => {
            return (
              <li className="category-list" key={index} onClick={() => categoriesChange(index)}>{category}</li>
            )
          }) 
        }
        </ul>

          {
            movies.map((movie, index) =>{
              return <div key={index} className={'movie-list'}>
                <InviewComponent
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

        {/* シェア */}
        <Drawer className="share-drawer-box" anchor='bottom' open={shareDrawer} onClick={() => setShareDrawer(!shareDrawer)} >
          <div className="share-title">シェア：</div>
          <div className="share-drawer">
            <div>
              <Avatar
                color="secondary"
                className="copy-link"
                alt=""
                src={CopyLink}
              />
              <div>リンクをコピー</div>
            </div>
            <div>
              <TwitterShareButton onClick={() => postShare(1)} url={"https://www.google.com/?hl=ja"}>
                  <TwitterIcon size={50} round />
              </TwitterShareButton>
              <div>twitter</div>
            </div>
            <div>
              <LineShareButton onClick={() => postShare(2)} url={"https://www.google.com/?hl=ja"}>
                <LineIcon size={50} round />
              </LineShareButton>
              <div>Line</div>
            </div>
          </div>
          <div className="share-footer">
            <Button onClick={() => setShareDrawer(false)}>キャンセル</Button>
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
          <Avatar
            alt=""
            className="menu-icon"
            src={isSideMenu ? SideImageBlack : SideImageWhite}
            onClick={() => openSideMenu(!isSideMenu)}
          />
        </footer>
      </ThemeProvider>
    </React.Fragment>
  );
}

export default Movies
