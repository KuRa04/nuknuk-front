import axios from 'axios';

// const dbUrl = process.env.REACT_APP_HEROKU_DB_URL + '/movies'
const dbUrl = process.env.REACT_APP_LOCAL_DB_URL + '/movies'

/**
 * @param {*} channelName シェアするチャネル名
 */
async function getMovieLists(small_tab, large_tab, movie_id, page, ip_address, shareMovieUrl) {
  const getMovieUrl = shareMovieUrl ? dbUrl + shareMovieUrl : dbUrl
  let movies = []
  const param = {
    small_tab: small_tab,
    large_tab: large_tab,
    movie_id: movie_id,
    page: page,
    ip_address: ip_address
  }
  await axios.get(getMovieUrl, { params: param }).then((res) => {
    console.log(res.data)
    movies = res.data.movies
  }).catch((data) => {
    console.log(data)
  })
  return movies
}

const moviesController = {
  getMovieLists,
}

export default moviesController