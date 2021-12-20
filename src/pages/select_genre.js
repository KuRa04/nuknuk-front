import React, { useEffect, useState }  from 'react'
import "../styles/pages/genre.scss";
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import genresController from '../controller/select_genres_controller';

/**
 * @param {*} props
 * ip_address closeSelectGenreMenu()
 */
const SelectGenre = (props) => {
  const dbUrl = process.env.REACT_APP_HEROKU_DB_URL;
  // const dbUrl = process.env.REACT_APP_LOCAL_DB_URL

  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const ip_address = props.ip_address

  useEffect( () => {
    const param = {ip_address: ip_address}
    axios.get(dbUrl + "/selected_first_genres", {params: param}).then((res) => {
      const genresObj = JSON.parse(res.data.selected_first_genres)
      setGenres(genresObj)
      const alreadySelected = []
      genresObj.forEach((item) => {
        if (item.is_selected){
          alreadySelected.push(item.name)
        }
      })
      setSelectedGenres(alreadySelected)
    }).catch((res) => {
      console.log(res)
    })
  }, [dbUrl, ip_address])

  /**
   * 選択したジャンルのオン・オフ切り替え
   * 選択した値を状態変数に代入
   * 選択された値のis_selectedを変更
   * @param {number} index
   */
  const addSelectedGenres = (genre) => {
    let selectGenres = selectedGenres
    const alreadySelected = selectGenres.includes(genre.name)
    if (alreadySelected) {
      selectGenres = selectGenres.filter((name) => !name.match(genre.name))
    }else {
      selectGenres.push(genre.name)
    }
    setSelectedGenres(selectGenres)
    const toggleSelectedGenres = genres.map((item) => {
      return {
        ...item,
        is_selected: item.id === genre.id ? !genre.is_selected : item.is_selected
      }
    })
    setGenres(toggleSelectedGenres)
  }

  /**
   * emitでメニューを閉じる
   */
  const closeSelectGenreMenu = () => {
    props.closeSelectGenreMenu()
  }

  const postSelectGenre = async () => {
    await genresController.postSelectedGenres(selectedGenres, props.ip_address)
    closeSelectGenreMenu()
  }

  return (
    <div className="wrap_select_genres">
      <div className="page_title">こだわり条件</div>
      <CloseIcon
        className="close_icon"
        fontSize="large"
        style={{ color: 'white' }}
        onClick={() => closeSelectGenreMenu()}
      />
      <div className="sub_text">興味関心は表示内容のカスタマイズに使用されます。</div>
      <div className="genres_group">
        {genres.map((genre, index) => {
          return <button
            key={index}
            onClick={() => addSelectedGenres(genre)}
            variant="contained"
            className={genre.is_selected ? 'selected_genre_button genre_select_button' : 'un_selected_genre_button genre_select_button'}
          >
            <p className="genre_title">
              {genre.name}
            </p>
          </button>
        })}
      </div>
      <div className="footer_wrap">
        <button
          onClick={() => postSelectGenre()}
          variant="contained"
          className="next_button"
        >条件を適用</button>
      </div>
    </div>
  );
};
export default React.forwardRef(SelectGenre);