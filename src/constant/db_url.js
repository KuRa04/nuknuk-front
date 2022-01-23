let dbUrl = ""
if (process.env.REACT_APP_ENVIRONMENT === 'development') {
  dbUrl = process.env.REACT_APP_LOCAL_DB_URL
}else if (process.env.REACT_APP_ENVIRONMENT === 'production') {
  dbUrl = process.env.REACT_APP_PRODUCTION_DB_URL
}else {
  dbUrl = process.env.REACT_APP_HEROKU_DB_URL;
}
console.log(dbUrl)
export default dbUrl
