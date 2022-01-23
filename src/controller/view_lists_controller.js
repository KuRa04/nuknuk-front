import axios from '../constant/axios'

/**
 * @param {*} channelName シェアするチャネル名
 */
async function postViewList(movieId, ip_address) {
  await axios.post('/api/v1/viewlists', {
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