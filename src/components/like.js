import React, { useState, useEffect, useRef, useLayoutEffect } from "react"
import {Button, AppBar, Tabs, Tab, Toolbar, Drawer, Box, List, ListItem, Avatar, createTheme, ThemeProvider} from '@material-ui/core'
import axios from 'axios'
import TitleLogo from '../images/title_logo.png'
import FavoriteImg from '../images/favorite.png'

const Likes = (props) => {
  const [count, setCount] = useState(props.movie_favorites_count)
  const [isLiked, setLiked] = useState(props.isLiked)

  const db_url = props.db_url

  const postFavorites = async (movie, e) => {
    e.stopPropagation()
    const favorites_db = db_url + '/favorites'
    if (isLiked) {
      const params = {movie_id: movie.id}
      console.log(params)
      axios.delete(favorites_db, {data: params}).then((res) => {
        console.log(res.data)
        const isBool = !isLiked
        setLiked(isBool)
        console.log(isLiked)
        const new_count = res.data.movie_favorites_count
        setCount(new_count)
      }).catch((res) => {
        console.log(res)
      })
    }else {
      axios.post(favorites_db, {movie_id: movie.id}).then((res) => {
        const isBool = !isLiked
        setLiked(isBool)
        const new_count = res.data.movie_favorites_count
        setCount(new_count)
        console.log(count)
      }).catch((res) => {
        console.log(res)
      })
    }
  }

  useEffect(() => {
    setCount(count)
  }, [count])

  useEffect(() => {
    setLiked(isLiked)
  }, [count])

  return (
    <div className="wrapper-favorites">
      <img onClick={(e) => postFavorites(props.movie, e)} width="50" height="50" src={isLiked ? TitleLogo : FavoriteImg}  />
      <span className="favorites-count">{count}</span>
    </div>
  )
}




export default Likes