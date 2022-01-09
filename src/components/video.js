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
      id={'movie-list-' + props.movie.id}
      preload="metadata"
      ref={props.videoRef}
      onEnded={props.onEnded}
      className="video-wrapper"
    >
      <source src={props.movie.movie_url} type="video/mp4" />
    </video>
  )
}

export default VideoComponent