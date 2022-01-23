import React from 'react';

const VideoComponent = (props) => {
  return (
    <>
      <video
        muted
        controls={false}
        playsInline
        width="100%"
        height="300"
        poster={props.movie.image}
        id={'movie-list-' + props.movie.id}
        preload="none"
        ref={props.videoRef}
        onEnded={props.onEnded}
      >
        <source src="" type="video/mp4"></source>
      </video>
    </>
  )
}

export default VideoComponent