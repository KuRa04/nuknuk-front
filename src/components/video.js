import React from 'react';
import "../styles/components/video.scss"

const VideoComponent = (props) => {
 return (
  <video
    muted={true}
    controls={false}
    playsInline
    width="370"
    height="300"
    poster={props.movie.image}
    src={props.movie.movie_url}
    id={'movie-list-' + props.movie.id}
    preload="metadata"
    ref={props.videoRef}
    onEnded={props.onEnded}
    className="video-wrapper"
  >
  </video>
 )
}

export default VideoComponent;