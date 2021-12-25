import axios from 'axios';

// const dbUrl = process.env.REACT_APP_HEROKU_DB_URL;
const dbUrl = process.env.REACT_APP_LOCAL_DB_URL

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