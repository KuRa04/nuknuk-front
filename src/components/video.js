import React from 'react';

const VideoComponent = (props) => {
 return (
  <video
    muted
    controls={false}
    playsInline
    width="370"
    height="300"
    poster={props.movie.image}
    src={props.movie.movie_url +  "#t=3"}
    id={'movie-list-' + props.movie.id}
    preload="metadata"
    ref={props.videoRef}
  >
  </video>
 )
}

export default VideoComponent;