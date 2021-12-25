import axios from 'axios';

// const dbUrl = process.env.REACT_APP_HEROKU_DB_URL;
const dbUrl = process.env.REACT_APP_LOCAL_DB_URL

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