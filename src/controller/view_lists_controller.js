import axios from 'axios';
import {dbUrl} from '../constant/db_url'

/**
 * @param {*} channelName シェアするチャネル名
 */
async function postViewList(movieId, ip_address) {
  await axios.post(dbUrl + '/viewlists', {
    ip_address: ip_address,
    movie_id: movieId,
  }).then((res) => {
    console.log(res.data)
  }).catch((data) => {
    console.log(data)
  })
}

const viewListsController = {
  postViewList,
}

export default viewListsController