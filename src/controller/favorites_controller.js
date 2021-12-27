import axios from 'axios';
import {dbUrl} from '../constant/db_url'

const endpoint = dbUrl + '/favorites'

/**
 * @param {*} movieId いいねする動画のID
 * @param {*} ip_address ユーザーのIPアドレス
 * @return {*} newFavorites いいねした後のいいね数
 */
async function createFavorite(movieId, ip_address) {
  let newFavorites = null
  await axios.post(endpoint, {
    movie_id: movieId,
    ip_address: ip_address
  }).then((res) => {
    console.log(res.data)
    newFavorites = res.data
  }).catch((data) => {
    console.log(data)
  })
  return newFavorites
}

/**
 * @param {*} movieId いいねを削除する動画のID
 * @param {*} ip_address ユーザーのIPアドレス
 * @return {*}  いいね削除後のいいね数
 */
async function deleteFavorite(movieId, ip_address) {
  let newFavorites = 0
  const params = { movie_id: movieId, ip_address: ip_address }
  await axios.delete(endpoint, { data: params}).then((res) => {
    console.log(res.data)
    newFavorites = res.data
  }).catch((data) => {
    console.log(data)
  })
  return newFavorites
}

const favoritesController = {
  createFavorite,
  deleteFavorite
}

export default favoritesController