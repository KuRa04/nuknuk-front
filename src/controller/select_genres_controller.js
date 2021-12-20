import axios from 'axios';

const dbUrl = process.env.REACT_APP_HEROKU_DB_URL;
// const dbUrl = process.env.REACT_APP_LOCAL_DB_URL

/**
 * (コントロール + option + D) * 2
 * @param {*} genres ジャンルの一覧
 * @param {*} ip_address ipアドレス
 */
async function postSelectedGenres(genres, ip_address) {
  console.log(genres, ip_address)
  await axios.post(dbUrl + '/visitors_selected_genres', {
    select_genres: genres,
    ip_address: ip_address,
  }).then((res) => {
    console.log(res.data)
  }).catch((data) => {
    console.log(data)
  })
}

const genresController = {
  postSelectedGenres,
}

export default genresController