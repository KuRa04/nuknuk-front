import axios from '../constant/axios'

/**
 * @param {*} movieId 購入遷移された動画ID
 * @param {*} ip_address 購入遷移した人
 */
async function postPurchase(movieId, ip_address) {
  await axios.post('/api/v1/purchases', {
    movie_id: movieId,
    ip_address: ip_address,
  }).then((res) => {
    console.log(res.data)
  }).catch((data) => {
    console.log(data)
  })
}

const purchaseController = {
  postPurchase,
}

export default purchaseController