import React, { useState, useEffect } from "react"
import axios from 'axios'
import {AppBar, Tabs, Tab, Toolbar, Drawer, Box, List, ListItem, Avatar, createTheme, ThemeProvider} from '@material-ui/core'
import LogoWhite from '../images/logo_white.png'
import SideImageWhite from '../images/side_menu.png'
import SideImageBlack from '../images/side_menu_black.png'
import Likes from '../components/like'
import Purchases from '../components/purchase'
import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share'
import "../styles/pages/movies.scss";

const Movies = (props) => {
  // 状態変数
  const [movies, setMovie] = useState([])
  const [isSideMenu, openSideMenu] = useState(false)
  const [tabValue, setTabValue] = useState(1)

  // dbのパス
  // const db_url = Rails.env === 'development' ? DB_LOCAL_URL : DB_PRODUCTION_URL
  const db_url = props.db_url

  // const data = useCallback( async () => {
  // let array = [];
  //  await axios.get(db_url + '/movies').then((res) => {
  //   console.log(res.data.movies)
  //   array = res.data.movies.slice(0,10);
  //   console.log(array)
  //     // setMovie(array)
  //   }).catch((res) => {
  //     console.log(res)
  //   })
  //   console.log(array)
  //   return array;
  // }, []);

  useEffect( () => {
     axios.get(db_url + '/movies').then((res) => {
      console.log(res.data.movies)
      const array = res.data.movies.slice(0,10);
      console.log(array)
      setMovie(array)
      }).catch((res) => {
        console.log(res)
      })
  }, []);

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

  // const switchStopPlaying = (index) => {
  //   console.log("aaa")
  //   let video = document.getElementById("movie-list-" + index);
  //   if(video.paused) {
  //     video.play()
  //   }else {
  //     video.pause();
  //   }
  // }

  const postShare = (movieId, channelName) => {
    console.log(movieId)
    console.log(channelName)
    axios.post(db_url + '/shares', {
      channel: channelName,
      movie_id: movieId,
    }).then((res) => {
      console.log(res.data.shares)
    }).catch((data) => {
      console.log(data)
    })
  }
  const toggleFavorites = (movie_ip_address) => {
    console.log(movie_ip_address.includes(props.ip_address))
    return props.ip_address && movie_ip_address.includes(props.ip_address)
  }

  // const HTMLComponent = ({ htmlString }) => {
  //   const divRef = useRef();

  //   useLayoutEffect(() => {
  //     if (!divRef.current) {
  //       return;
  //     }
  //     else
  //     {
  //       video.pause();
  //       playPauseStatus = "pause"
  //     }
  // }

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
          {/* <div className="wrapper-favorites">
            <img onClick={(e) => postFavorites(props.movie, e)} width="50" height="50" src={toggleFavorites(props.movie.favorite_ip_address) ? TitleLogo : FavoriteImg}  />
            <span className="favorites-count">{movie.favorites_count}</span>
          </div> */}
          <Likes
            movie={props.movie}
            db_url={db_url}
            isLiked={toggleFavorites(props.movie.favorite_ip_address)}
            movie_favorites_count={props.movie.favorites_count}
          />
          <div className="share-btn">
            <TwitterShareButton onClick={() => postShare(props.movie.id, 1)} url={"https://www.google.com/?hl=ja"}>
                <TwitterIcon size={50} round />
            </TwitterShareButton>
            <FacebookShareButton onClick={() => postShare(props.movie.id, 2)} url={"https://www.google.com/?hl=ja"}>
                <FacebookIcon size={50} round />
            </FacebookShareButton>
          </div>
        </div>
      </div>
    )
  }

  const InviewComponent =  (props) => {
    // let video = document.getElementById("movie-list-" + props.index);

    return (
      <MovieComponent movie={props.movie} movieTitle={props.title} index={props.index} movieImage={props.movieImage} movieUrl={props.movieUrl} affiliateLink={props.affiliateLink}/>
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
          {
            movies.map((movie, index) =>{
              return <div key={index} className={'movie-list'}>
                <InviewComponent index={index} movie={movie} title={movie.title} movieImage={movie.image} movieUrl={movie.movie_url} affiliateLink={movie.affiliate_link} />
              </div>
            })
          }
        {/* <HTMLComponent className="jtw6poe" htmlString={"<script id=\"mgs_Widget_affiliate\" type=\"text/javascript\" charset=\"utf-8\" src=\"https://static.mgstage.com/mgs/script/common/mgs_Widget_affiliate.js?c=CENI825OEAJYTYAC2ZYLTSZAM3&t=text&o=f&b=t&s=%E3%81%8A%E5%A4%A9%E6%B0%97%E3%82%AD%E3%83%A3%E3%82%B9%E3%82%BF%E3%83%BC%20%E7%BE%8E%E5%92%B2%E3%81%AA%E3%81%AA(23)%20AV%E3%83%87%E3%83%93%E3%83%A5%E3%83%BC%20%E3%83%8D%E3%83%83%E3%83%88%E9%85%8D%E4%BF%A1%E3%81%AE%E3%81%8A%E5%A4%A9%E6%B0%97%E3%82%AD%E3%83%A3%E3%82%B9%E3%82%BF%E3%83%BC%E3%81%8C%E3%83%89%E3%82%AD%E3%83%89%E3%82%AD%E5%88%9D%E6%92%AE%E3%82%8ASEX%E3%81%A7%E5%A4%A7%E8%88%88%E5%A5%AE%EF%BC%81%EF%BC%81&p=DIC-078&from=ppv&class=jtw6poe\"></script>"} />
        <span className="jtw6poe"></span> */}

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
