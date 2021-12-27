import React, { useState } from 'react';
import SwipeableViews from 'react-swipeable-views';
import {AppBar, Tabs, Tab, Toolbar, Drawer, Box, List, ListItem, createTheme, ThemeProvider, Modal} from '@material-ui/core'
import LogoWhite from '../images/logo_white_2.svg'
import SideImageWhite from '../images/side_menu_white.svg'
import SideImageBlack from '../images/side_menu_black.svg'
import SelectCategoryIcon from '../images/select_category.svg'
import banImg from '../images/ban.svg'
import SelectGenre from './select_genre'
import "../styles/pages/movies.scss";
import { addingBigAndSmallTabs, smallTabs } from '../constant/tabs'
import VerticalMovieLists from '../components/vertical_movie_lists'
import EntityEmptyVideo from '../components/entity_empty_video'

const Movies = (props) => {
  // 状態変数
  const [isSideMenu, openSideMenu] = useState(false)
  const [isSelectCategoryMenu, openSelectCategoryMenu] = useState(false)
  const [bigTabValue, setBigTabValue] = useState(0)
  const [horizontalSwipeValue, setHorizontalSwipeValue] = useState(0)
  const [smallTabValue, setSmallTabValue] = useState(0)

  /**
   * bigTabの切替
   * スワイプとクリックの両方で呼び出される
   * @param {*} value bigTabの値 0, 1, 13
   * @param {*} text bigTabの名称 人気, ジャンル別, おすすめ
   */
  const changeBigTabValue = async (value, text) => {
    value === 1 && setSmallTabValue(smallTabs.indexOf(text))
    // const array = await moviesController.getMovieLists(value, largeTab, null, 1, props.ip_address, null)
    // setMovieLists(array)
    setBigTabValue(value)
    setHorizontalSwipeValue(value)
  }

  /**
   * スワイプしたときのタブの切替
   * horizontalSwipeValueとsmallTabValueの値を両方切り替える必要がある
   * @param {*} value horizontalSwipeValueの値
   */
  const changeHorizontalSwipeValue = (value) => {
    switch (value) {
      case 0:
      case 13:
        changeBigTabValue(value, addingBigAndSmallTabs[value])
        break;
      case 1:
      case 12:
        setBigTabValue(1)
        console.log(value)
        --value //smallTabsでは人気、おすすめが含まれていないため、-1する
        changeSmallTabValue(value, smallTabs[value])
        break;
      default:
        changeSmallTabValue(value,addingBigAndSmallTabs[value])
        break;
    }
  }

  /**
   * smallTabの切替
   * スワイプとクリックの両方で呼び出される
   * @param {*} value smallTabの値（constantを参照）
   * @param {*} text smallTabの名称（constantを参照）
   */
  const changeSmallTabValue = async (value, text) => {
    // const array = await moviesController.getMovieLists(value, 'genre', null, 1, props.ip_address, null)
    // setMovieLists(array)
    setHorizontalSwipeValue(value)
    setSmallTabValue(smallTabs.indexOf(text))
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
                value={bigTabValue} // 0人気 1新着
                onChange={() => changeBigTabValue}
                TabIndicatorProps={{style: {background:'#EFE060', height: "2.8px", borderRadius: "8%"
              }}}
                centered
              >
                <Tab label="人気" style={{color: "#F0F0F0", fontSize: '17px', paddingLeft: "0px", paddingRight: "0px", marginLeft: "12px", marginRight: "12px", }} onClick={() => changeBigTabValue(0, '人気')} />
                <Tab label="ジャンル別" style={{color: "#F0F0F0", fontSize: '17px', paddingBottom: "2.5px", paddingLeft: "0px", paddingRight: "0px", marginLeft: "12px", marginRight: "12px"}} onClick={() => changeBigTabValue(1, '素人')} />
                <Tab label="おすすめ" style={{color: "#F0F0F0", fontSize: '17px', paddingBottom: "2.5px", paddingLeft: "0px", paddingRight: "0px", marginLeft: "12px", marginRight: "12px"}} value={13} onClick={() => changeBigTabValue(13, 'おすすめ')}  />
              </Tabs>
              { bigTabValue === 1 &&
                <Tabs
                  value={smallTabValue} // bigTabValue ⇨ smallTabValueに変更
                  onChange={() => changeSmallTabValue}
                  variant='scrollable'
                  TabIndicatorProps={{style: {display: "none"}}}
                >
                  {/* <Tab value={0} /> */}
                  {
                    smallTabs.map((category, index) => {
                      return <Tab
                        label={category}
                        value={index}
                        key={'category-' + index}
                        className={smallTabValue === index ? "select_small_tab" : 'un_select_small_tab'}
                        onClick={() => changeSmallTabValue(index, category)}
                      />
                    }) }
                </Tabs>
              }
            </AppBar>
          </Box>
          <SwipeableViews index={horizontalSwipeValue} onChangeIndex={changeHorizontalSwipeValue}>
            { addingBigAndSmallTabs.map((_, index) => {
              return (
                <div key={"genre-movie-" + index}>
                  { horizontalSwipeValue === index ? 
                    <VerticalMovieLists
                      smallTabValue={smallTabValue}
                      bigTabValue={bigTabValue}
                      ip_address = {props.ip_address}
                    /> 
                    : <EntityEmptyVideo /> 
                  }
                </div>
              )
            })}
          </SwipeableViews>
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
        <footer className="footer"></footer>
      </div>
      </ThemeProvider>
      <Modal open={isSelectCategoryMenu}>
        <SelectGenre ip_address={props.ip_address} closeSelectGenreMenu={() => props.displayLottie()} />
      </Modal>
    </React.Fragment>
  );
}

export default Movies
