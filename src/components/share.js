import React, { useState, useEffect} from "react"
import ShareButton from '../images/share.svg'
import "../styles/components/share.scss"

const Shares = (props) => {
  const [count, setCount] = useState(props.movie.shared_movies_count)

  const toggleShare = () => {
    props.onToggle(props.movie.id)
  }

  useEffect(() => {
    setCount(count)
  }, [count])

  return (
    <>
      <img src={ShareButton} alt='menu' width={35} height={35}  onClick={toggleShare}/>
      <span className="shares_count">{count}</span>
    </>
  )
}

export default Shares;