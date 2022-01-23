import axios from 'axios';
import dbUrl from '../constant/db_url';

const instance = axios.create({
  baseURL: dbUrl,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 2000,
})

export default instance;