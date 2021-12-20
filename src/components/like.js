// import React, { useState, useEffect } from "react"
// import axios from 'axios'
// import BeforeFavoriteImg from '../images/before_favorite.svg'
// import AfterFavoriteImg from '../images/after_favorite.svg'
// import "../styles/components/like.scss";

// const Likes = (props) => {
//   const [count, setCount] = useState(props.movie_favorites_count)
//   const [isLiked, setLiked] = useState(props.isLiked)

//   const dbUrl = props.dbUrl

//   const postFavorites = async (movie, e) => {
//     e.stopPropagation()
//     const favorites_db = dbUrl + '/favorites'
//     if (props.isLiked) {
//       console.log(props.ip_address)
//       const params = {movie_id: movie.id, ip_address: props.ip_address}
//       console.log(params)
//       axios.delete(favorites_db, {data: params}).then((res) => {
//         console.log(res.data)
//         const isBool = !props.isLiked
//         setLiked(isBool)
//         console.log(isLiked)
//         const new_count = res.data.movie_favorites_count
//         setCount(new_count)
//       }).catch((res) => {
//         console.log(res)
//       })
//     }else {
//       console.log(dbUrl)
//       axios.post(favorites_db, {movie_id: movie.id, ip_address: props.ip_address}).then((res) => {
//         console.log(favorites_db)
//         const isBool = !props.isLiked
//         setLiked(isBool)
//         const new_count = res.data.movie_favorites_count
//         setCount(new_count)
//         console.log(count)
//       }).catch((res) => {
//         console.log(res)
//       })
//     }
//   }

//   useEffect(() => {
//     setCount(count)
//   }, [count])

//   useEffect(() => {
//     setLiked(props.isLiked)
//   }, [props.isLiked])

//   return (
//     <div className="wrapper_favorites">
//       <img onClick={(e) => postFavorites(props.movie, e)} alt="" width="35" height="35" src={props.isLiked ? AfterFavoriteImg : BeforeFavoriteImg}  />
//       <span className="favorites_count">{count}</span>
//     </div>
//   )
// }




// export default Likes