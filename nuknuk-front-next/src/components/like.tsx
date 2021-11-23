import React, { useState, useEffect, MouseEventHandler } from "react"
import Image from 'next/image'
import axios from 'axios'
import BeforeFavoriteImg from '../../public/images/before_favorite.svg'
import AfterFavoriteImg from '../../public/images/after_favorite.svg'
import styles from "../../styles/components/like.module.css";

interface Props {
  ip_address: string
  onClick?: Function
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

const Likes = (props: Props) => {
  const [count, setCount] = useState(props.movie.favorites_count)
  const [isLiked, setLiked] = useState(props.movie.is_favorited)

  const dbUrl = process.env.NEXT_PUBLIC_HEROKU_DB_URL;

  const postFavorites = async (e: any, movieIp_address: string) => {
    e.stopPropagation()
    const favorites_db = dbUrl + '/favorites'
    if (isLiked) {
      console.log(props.ip_address)
      const params = {movie_id: props.movie.id, ip_address: props.ip_address}
      console.log(params)
      axios.delete(favorites_db, {data: params}).then((res) => {
        console.log(res.data)
        const isBool = !isLiked
        setLiked(isBool)
        console.log(isLiked)
        const new_count = res.data.movie.favorites_count
        setCount(new_count)
      }).catch((res) => {
        console.log(res)
      })
    }else {
      console.log(props.ip_address)
      axios.post(favorites_db, {movie_id: props.movie.id, ip_address: props.ip_address}).then((res) => {
        const isBool = !isLiked
        setLiked(isBool)
        const new_count = res.data.movie.favorites_count
        setCount(new_count)
        console.log(count)
      }).catch((res) => {
        console.log(res)
      })
    }
    return props.ip_address && movieIp_address.includes(props.ip_address)
  }

  useEffect(() => {
    setCount(count)
  }, [count])

  useEffect(() => {
    setLiked(isLiked)
  }, [isLiked])

  return (
    <div className={styles.wrapper_favorites}>
      <Image src={isLiked ? AfterFavoriteImg : BeforeFavoriteImg} alt='menu' width={35} height={35} onClick={(e) => postFavorites(e, props.ip_address)} />
      <span className={styles.favorites_count}>{count}</span>
    </div>
  )
}




export default Likes