import axios from 'axios'
import {dbUrl} from '../constant/db_url'

/**
 * @param {*} channelName シェアするチャネル名
 */
async function postShare(channelName, movieId) {
  await axios.post(dbUrl + '/shares', {
    channel: channelName,
    movie_id: movieId,
  }).then((res) => {
    console.log(res.data)
  }).catch((data) => {
    console.log(data)
  })
}

const sharesController = {
  postShare,
}

export default sharesController