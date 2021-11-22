import React, { useState, useEffect, MouseEventHandler } from "react"
import Image from 'next/image'
import axios from 'axios'
import { Drawer, Button} from '@material-ui/core'
import ShareButton from '../../public/images/share.svg'
import CopyLink from '../../public/images/clip.svg'
import {
  LineShareButton,
  LineIcon,
  TwitterShareButton,
  TwitterIcon
} from 'react-share'
import styles from "../../styles/components/like.module.css";

interface Props {
  ip_address: string
  onToggle: (id: number) => void
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

const Shares = (props: Props) => {
  const [count, setCount] = useState(props.movie.shared_movies_count)

  const dbUrl = process.env.NEXT_PUBLIC_HEROKU_DB_URL;

  const toggleShare = () => {
    props.onToggle(props.movie.id)
  }

  useEffect(() => {
    setCount(count)
  }, [props.movie.shared_movies_count])

  return (
    <>
      <Image src={ShareButton} alt='menu' width={35} height={35}  onClick={toggleShare}/>
      <span className={styles.favorites_count}>{count}</span>
    </>
  )
}

export default Shares;