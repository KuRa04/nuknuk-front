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
import { addingBigAndSmallTabs, smallTabs, largeTabs } from '../constant/tabs'
import VerticalMovieLists from '../components/vertical_movie_lists'
import EntityEmptyVideo from '../components/entity_empty_video'

const Movies = (props) => {
  // 状態変数
  const [isSideMenu, openSideMenu] = useState(false)
  const [isSelectCategoryMenu, openSelectCategoryMenu] = useState(false)
  const [bigTabValue, setBigTabValue] = useState(1)
  const [horizontalSwipeValue, setHorizontalSwipeValue] = useState(12)
  const [smallTabValue, setSmallTabValue] = useState(0)

  /**
   * bigTabの切替
   * スワイプとクリックの両方で呼び出される
   * @param {*} value bigTabの値 0, 1, 2
   * @param {*} text bigTabの名称 人気, ジャンル別, おすすめ
   */
  const changeBigTabValue = async (text) => {
    let bigValue = largeTabs.indexOf(text)
    let allTabText = addingBigAndSmallTabs.indexOf(text)
    if (allTabText < 0) {
      setSmallTabValue(0)
      allTabText = 0
      bigValue = 0
    }
    setBigTabValue(bigValue)
    setHorizontalSwipeValue(allTabText)
  }

  /**
   * スワイプしたときのタブの切替
   * horizontalSwipeValueとsmallTabValueの値を両方切り替える必要がある
   * @param {*} value horizontalSwipeValueの値
   */
  const changeHorizontalSwipeValue = (value) => {
    switch (value) {
      case 0:
      case 11:
        setBigTabValue(0)
        changeSmallTabValue(smallTabs[value])
        break;
      case 12:
        changeBigTabValue(addingBigAndSmallTabs[value])
        break;
      default:
        changeSmallTabValue(addingBigAndSmallTabs[value])
        break;
    }
  }

  /**
   * smallTabの切替
   * スワイプとクリックの両方で呼び出される
   * @param {*} value smallTabの値（constantを参照）
   * @param {*} text smallTabの名称（constantを参照）
   */
  const changeSmallTabValue = async (text) => {
    setSmallTabValue(smallTabs.indexOf(text))
    setHorizontalSwipeValue(addingBigAndSmallTabs.indexOf(text))
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
                boxShadow: 'none' // ボックスシャドウを削除
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
                {
                  largeTabs.map((largeTab, index) => {
                    return (
                      <Tab label={largeTab}
                        style={
                          {
                            color: "#F0F0F0",
                            fontSize: '17px',
                            paddingLeft: "0px",
                            paddingRight: "0px",
                            marginLeft: "12px",
                            marginRight: "12px"
                          }
                        }
                        onClick={() => changeBigTabValue(largeTab)} key={'largeTab' + index }
                      />
                    )
                  })
                }
              </Tabs>
              { bigTabValue === 0 &&
                <Tabs
                  value={smallTabValue}
                  onChange={() => changeSmallTabValue}
                  variant='scrollable'
                  TabIndicatorProps={{style: {display: "none"}}}
                >
                  {
                    smallTabs.map((category, index) => {
                      return <Tab
                        label={category}
                        value={index}
                        key={'category-' + index}
                        className={smallTabValue === index ? "select_small_tab" : 'un_select_small_tab'}
                        onClick={() => changeSmallTabValue(category)}
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
                      isSelectCategoryMenu={isSelectCategoryMenu}
                      isSideMenu={isSideMenu}
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
