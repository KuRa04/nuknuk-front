import axios from 'axios';

// const dbUrl = process.env.REACT_APP_HEROKU_DB_URL + '/favorites'
const dbUrl = process.env.REACT_APP_LOCAL_DB_URL + '/favorites'


/**
 * @param {*} movieId いいねする動画のID
 * @param {*} ip_address ユーザーのIPアドレス
 * @return {*} newCount いいねした後のいいね数
 */
async function createFavorite(movieId, ip_address) {
  let newCount = 0
  await axios.post(dbUrl, {
    movie_id: movieId, 
    ip_address: ip_address
  }).then((res) => {
    console.log(res.data)
    newCount = res.data.movie_favoritesCount
  }).catch((data) => {
    console.log(data)
  })
  return newCount
}

/**
 * @param {*} movieId いいねを削除する動画のID
 * @param {*} ip_address ユーザーのIPアドレス
 * @return {*}  いいね削除後のいいね数
 */
async function deleteFavorite(movieId, ip_address) {
  let newCount = 0
  const params = { movie_id: movieId, ip_address: ip_address }
  await axios.delete(dbUrl, { data: params}).then((res) => {
    console.log(res.data)
    newCount = res.data.movie_favoritesCount
  }).catch((data) => {
    console.log(data)
  })
  return newCount
}

const favoritesController = {
  createFavorite,
  deleteFavorite
}

export default favoritesController