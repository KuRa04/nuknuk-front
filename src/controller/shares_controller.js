import axios from '../constant/axios'

/**
 * @param {*} channelName シェアするチャネル名
 */
async function postShare(channelName, movieId) {
  await axios.post('/api/v1/shares', {
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