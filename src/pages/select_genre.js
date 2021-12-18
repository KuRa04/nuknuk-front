import React, { useEffect, useState }  from 'react'
import "../styles/pages/genre.scss";
import axios from 'axios';

const SelectGenre = () => {
  // const dbUrl = process.env.REACT_APP_HEROKU_DB_URL;
  const dbUrl = process.env.REACT_APP_LOCAL_DB_URL

  const [genres, setGenres] = useState([])

  useEffect( () => {
    axios.get(dbUrl + "/selected_first_genres").then((res) => {
      setGenres(JSON.parse(res.data.selected_first_genres))
    }).catch((res) => {
      console.log(res)
    })
  }, [dbUrl]);

  /**
   * 選択したジャンルのオン・オフ切り替え
   * @param {number} index
   */
  const selectedGenres = (genre) => {
    // ここでgenresのselectedを切り替えたい
    console.log(genre)
  }

  /**
   * 次へを押したときに発火
   */
  const nextTransition = () => {
    console.log("次へ")
  }

  return (
    <div className="wrap_select_genres">
      <div className="page_title">こだわり条件</div>
      <div className="sub_text">興味関心は表示内容のカスタマイズに使用されます。</div>
      <div className="genres_group">
        {genres.map((genre, index) => {
          return <button key={index} onClick={() => selectedGenres(genre)} variant="contained" className="genre_select_button">
            <p className="genre_title">
              {genre.name}
            </p>
          </button>
        })}
      </div>
      <div className="footer_wrap">
        <button onClick={nextTransition} variant="contained" className="next_button" >条件を適用</button>
      </div>
    </div>
  );
};
export default React.forwardRef(SelectGenre);