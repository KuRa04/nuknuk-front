import axios from '../constant/axios'

const endpoint = '/api/v1/movies'

/**
 * @param {*} channelName シェアするチャネル名
 */
async function getMovieLists(small_tab, large_tab, movie_id, page, ip_address, shareMovieUrl) {
  const getMovieUrl = shareMovieUrl ? endpoint + shareMovieUrl : endpoint
  let movies = []
  const param = {
    small_tab: small_tab,
    large_tab: large_tab,
    movie_id: movie_id,
    page: page,
    ip_address: ip_address
  }
  console.log(param)
  await axios.get(getMovieUrl, { params: param }).then((res) => {
    console.log(res)
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