import React from "react"
import axios from 'axios'
import RightArrowImg from '../../public/images/right_arrow.svg'
import styles from "../../styles/components/purchase.module.css";

interface Props {
  ip_address: string
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

const Purchases = (props: Props) => {

  const db_url = process.env.NEXT_PUBLIC_HEROKU_DB_URL;

  const postPurchases = async (movie: Movie, e: any) => {
    e.stopPropagation()
    const purchases_db = db_url + '/purchases'
      axios.post(purchases_db, {movie_id: props.movie.id}).then((res) => {
        console.log(res.data)
      }).catch((res) => {
        console.log(res)
      })
    }

  return (
    <a className={styles.wrapper_purchases} href={props.movie.affiliate_link} onClick={(e) => postPurchases(props.movie, e)}>
      つづきを見る
      <img className={styles.right_arrow} alt="" width="10" height="10" src={RightArrowImg}  />
    </a>
  )
}

export default Purchases