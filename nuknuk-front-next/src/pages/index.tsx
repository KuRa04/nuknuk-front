import React, { useState, useEffect, useRef } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head'
import Image from 'next/image'
import useInView from "react-cool-inview"
import axios from 'axios';
import SwipeableViews from 'react-swipeable-views';
import {AppBar, Tabs, Tab, Toolbar, Drawer, Box, List, ListItem, createTheme, ThemeProvider, Button} from '@material-ui/core'
import LogoWhite from '../../public/images/logo_white_2.svg'
import ShareButton from '../../public/images/share.svg'
import CopyLink from '../../public/images/clip.svg'
import SideImageWhite from '../../public/images/side_menu_white.svg'
import SideImageBlack from '../../public/images/side_menu_black.svg'
import Likes from '../components/like'
import Shares from '../components/share'
import Purchases from '../components/purchase'
import RequestMovie from '../pages/api/axios'
import {
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share'
import styles from "../../styles/pages/index.module.css";

interface Props {
  ip_address: string
  index: number
  movie: {
    id: number
    title: string
    movie_url: string
    image: string
    affiliate_link: string
    favorite_ip_address: string
    favorites_count: number
    shared_movies_count: number
    movie_purchases_count: number
    is_favorited: boolean
  }
}

type Movie = {
  id: number
  title: string
  movie_url: string
  image: string
  affiliate_link: string
  favorite_ip_address: string
  favorites_count: number
  shared_movies_count: number
  movie_purchases_count: number
  is_favorited: boolean
}

type RequestMovieParam = {
  small_tab: string,
  large_tab: string,
  movie_id: number,
  page: number,
  ip_address: string,
}

const Page = (props: Props) => {
  const [movies, setMovie] = useState<Array<Movie>>([])
  const [isSideMenu, openSideMenu] = useState(false)
  const [tabValue, setTabValue] = useState(1)
  const [tabValueIndex, setTabValueIndex] = useState(1)
  const [categoryValue, setCategoryValue] = useState(0)
  const [shareDrawer, setShareDrawer] = useState(false)
  const [shareMovieId, setShareMovieId] = useState(0)
  const [shareCount, setShareCount] = useState(0)

  const categories = [
    "巨乳",
    "素人",
    "ナンパ",
    "ギャル",
    "OL",
    "人妻",
    "ハメ撮り",
    "スレンダー"
  ];

  // const dbUrl = process.env.NEXT_PUBLIC_HEROKU_DB_URL;
  const dbUrl = process.env.NEXT_PUBLIC_LOCAL_DB_URL;

  useEffect( () => {
    const searchUrl = window.location.search
    let getDbUrl = dbUrl
    getDbUrl += searchUrl ? "/movies" + searchUrl : "/movies"
    console.log(getDbUrl)
    const param = new RequestMovie(null, 'new', null, 1, "")
    axios.get<any>(getDbUrl, {params: param}).then((res) => {
      const array = res.data.movies;
      console.log(array)
      setMovie(array)
    }).catch((res) => {
      console.log(res)
    })
  }, [dbUrl]);

  // useEffect(() => {
  //   setShareCount(props.movie.shared_movies_count)
  // }, [shareCount])

  const tabsChange = (value: number) => {
    const param = new RequestMovie(null, null, null, null, null)
    switch(value) {
      case 0:
        axios.get<any>(dbUrl + '/movies', {params: param}).then((res) => {
          console.log(res.data.movies)
          const array = res.data.movies;
          setMovie(array)
          setTabValue(value)
          console.log("人気")
        }).catch((res) => {
          console.log(res)
        })
        break;
      case 1:
        const param = new RequestMovie(0, 'genre', null, 1, "")
        axios.get(dbUrl + '/movies').then((res) => {
          console.log(res.data.movies)
          const array = res.data.movies;
          setMovie(array)
          setTabValue(value)
          console.log("ジャンル別")
        }).catch((res) => {
          console.log(res)
        })
        break;
      case 2:
        axios.get(dbUrl + '/movies').then((res) => {
          console.log(res.data.movies)
          const array = res.data.movies;
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

  const tabsChangeIndex = (value: number) => {
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


  const categoriesChange = (value: number, text: string) => {
    axios.get(dbUrl + '/movies?tab_value=' + value).then((res) => {
      console.log(res.data.movies)
      const array = res.data.movies;
      console.log(array)
      console.log(dbUrl + '/popular_movies?tab_value=' + value)
      setMovie(array)
      setCategoryValue(categories.indexOf(text))
    }).catch((res) => {
      console.log(res)
    })
  }

  const postShare = (channelName: string) => {
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

  const toggleFavorites = (movieIp_address: string) => {
    console.log(movieIp_address.includes(props.ip_address))
    return props.ip_address && movieIp_address.includes(props.ip_address)
  }

  const toggleShareDrawer = (movie_id: number) => {
    setShareMovieId(movie_id)
    setShareDrawer(!shareDrawer)
  }

  const MovieComponent = (props: Props) => {
    const [isPlaying, setIsPlaying] = useState(false)
    const videoRef = useRef<HTMLVideoElement>();

    const playVideo = () => {
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
        if (videoRef != null || videoRef.current != null) {
          videoRef.current && videoRef.current.play();
          setIsPlaying(true);
          console.log("onEnter")
          console.log(videoRef)
          observe();
        }
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
        // videoRef.current && videoRef.current.remove(); 画面外に行ったら削除
        // videoRef.current.srcObject = null;
        observe();
      },
    });
    return (
      <div className={styles.wrapper_movie} id={"movie-url-" + props.movie.id} onClick={() => playVideo()}>
        <div ref={observe}>
          <video
            muted
            controls={false}
            playsInline
            width="370"
            height="300"
            poster={props.movie.image}
            src={props.movie.movie_url +  "#t=2"}
            id={'movie-list-' + props.index}
            preload="metadata"
            ref={videoRef}
          >
          </video>
        </div>
        <div className={styles.movie_object}>
          <div className={styles.wrapper_title}>
            <p className={styles.movie_title}>{props.movie.title}</p>
            <Purchases
              movie={props.movie}
              ip_address={props.ip_address}
            />
            </div>
            <div className={styles.video_btn}>
              <Likes
                movie={props.movie}
                ip_address={props.ip_address}
              />
              <div className={styles.share_btn}>
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
    palette: {
      primary: {
        main: '#000000',
      },
    },
  });

  return (
    <React.Fragment>
      <ThemeProvider theme={theme}>
        <div className={styles.main}>
        <Box sx={{height: 50}}>
          <AppBar
            style={{
              background: 'transparent', // AppBarの背景色を透明にする
              boxShadow: 'none'　// ボックスシャドウを削除
            }}
            position="fixed"
          >
            <Toolbar>
              <div className={styles.tool_bar}>
                <Image src={LogoWhite} alt=""/>
                <Image className={styles.menu_icon} src={isSideMenu ? SideImageBlack : SideImageWhite} alt='menu' width={35} height={35} onClick={() => openSideMenu(!isSideMenu)} />
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
                    >
                      <Tab label="巨乳" className={categoryValue === 0 ? styles.tab_color : styles.tab_not_color} style={{color: "#606060", fontSize: '14px'}} onClick={() => categoriesChange(0,"巨乳")} />
                      <Tab label="素人" className={categoryValue === 1 ? styles.tab_color : styles.tab_not_color} style={{color: "#606060", fontSize: '14px'}} onClick={() => categoriesChange(1, "素人")} />
                      <Tab label="ナンパ" className={categoryValue === 2 ? styles.tab_color : styles.tab_not_color} style={{color: "#606060", fontSize: '14px'}} onClick={() => categoriesChange(2, "ナンパ")} />
                      <Tab label="ギャル" className={categoryValue === 3 ? styles.tab_color : styles.tab_not_color} style={{color: "#606060", fontSize: '14px'}} onClick={() => categoriesChange(3, "ギャル")} />
                      <Tab label="OL" className={categoryValue === 4 ? styles.tab_color : styles.tab_not_color} style={{color: "#606060", fontSize: '14px'}} onClick={() => categoriesChange(5, "OL")} />
                      <Tab label="人妻" className={categoryValue === 5 ? styles.tab_color : styles.tab_not_color} style={{color: "#606060", fontSize: '14px'}} onClick={() => categoriesChange(7, "人妻")} />
                      <Tab label="ハメ撮り" className={categoryValue === 6 ? styles.tab_color : styles.tab_not_color} style={{color: "#606060", fontSize: '14px'}} onClick={() => categoriesChange(9, "ハメ撮り")} />
                      <Tab label="スレンダー" className={categoryValue === 7 ? styles.tab_color : styles.tab_not_color} style={{color: "#606060", fontSize: '14px'}} onClick={() => categoriesChange(12, "スレンダー")} />
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
            <div className={styles.movies}>
              {
                movies.map((movie, index) =>{
                  return <div key={index} className={styles.movie_list}>
                    <MovieComponent
                      index={index}
                      movie={movie}
                      ip_address={props.ip_address}
                      />
                  </div>
                })
              }
            </div>
            <div className={styles.movies}>
              {
                movies.map((movie, index) =>{
                  return <div key={index} className={styles.movie_list}>
                    <MovieComponent
                      index={index}
                      movie={movie}
                      ip_address={props.ip_address}
                      />
                  </div>
                })
              }
            </div>
            <div className={styles.movies}>
              {
                movies.map((movie, index) =>{
                  return <div key={index} className={styles.movie_list}>
                    <MovieComponent
                      index={index}
                      movie={movie}
                      ip_address={props.ip_address}
                      />
                  </div>
                })
              }
            </div>
          </SwipeableViews>
        </div>
        {/* シェア */}
        <Drawer className={styles.share_drawer_box} anchor='bottom' open={shareDrawer} onClick={() => setShareDrawer(!shareDrawer)} >
          <p className={styles.share_title}>シェア：</p>
          <div className={styles.share_drawer}>
            <div className={styles.share_icon}>
              <Image
                className={styles.copy_link}
                alt=""
                src={CopyLink}
                onClick={() => postShare("copy")}
                width={50}
                height={50}
              />
              <p className={styles.share_text}>リンクをコピー</p>
            </div>
            <div className={styles.share_icon}>
              <TwitterShareButton onClick={() => postShare("twitter")} url={"https://nuknuk-front-01.herokuapp.com?movie_id=" + shareMovieId}>
                  <TwitterIcon size={50} round />
              </TwitterShareButton>
              <p className={styles.share_text}>Twitter</p>
            </div>
            <div className={styles.share_icon}>
              <LineShareButton onClick={() => postShare("line")} url={"https://nuknuk-front-01.herokuapp.com?movie_id=" + shareMovieId}>
                <LineIcon size={50} round />
              </LineShareButton>
              <p className={styles.share_text}>LINE</p>
            </div>
          </div>
          <div className={styles.share_footer}>
            <Button className={styles.cancel_button} onClick={() => setShareDrawer(false)}>キャンセル</Button>
          </div>
        </Drawer>

        {/* サイドバー */}
        <Drawer anchor= 'left' open={isSideMenu} onClick={() => openSideMenu(!isSideMenu)} >
          <Box className={styles.sidebar} width="150px">
            <List>
              <ListItem>サイトポリシー</ListItem>
              <ListItem>お問い合わせ</ListItem>
            </List>
          </Box>
        </Drawer>

        <footer className={styles.footer}>
        </footer>
        </div>
      </ThemeProvider>
    </React.Fragment>
  );
}

// export const getStaticProps: GetStaticProps = async () => {
//   // posts を取得するため外部 API endpoint を読み込む
//   const dbUrl = process.env.NEXT_PUBLIC_HEROKU_DB_URL;
//   const res = await axios.get(dbUrl)
//   const movies = await res.data
//   console.log(movies)
//   // { props: { posts } }を返すことで、
//   // Blog コンポーネントはビルド時に`posts`を prop として受け取る
//   return {
//     props: {
//       movies
//     },
//   }
// }

export default Page;
