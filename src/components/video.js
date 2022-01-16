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
    id={'movie-list-' + props.movie.id}
    preload="preload"
    ref={props.videoRef}
    onEnded={props.onEnded}
    autoPlay
  >
    <source src="" type="video/mp4"></source>
  </video>
 )
}

export default VideoComponent