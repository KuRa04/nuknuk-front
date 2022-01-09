import React from 'react';

const VideoComponent = (props) => {
 return (
  <video
    muted={true}
    controls={false}
    playsInline
    width="100%"
    height="300"
    poster={props.movie.image}
    src={props.movie.movie_url}
    id={'movie-list-' + props.movie.id}
    preload="metadata"
    ref={props.videoRef}
    onEnded={props.onEnded}
  >
  </video>
 )
}

export default VideoComponent;