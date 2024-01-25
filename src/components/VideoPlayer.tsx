import React, { useRef } from "react";
import "node_modules/video-react/dist/video-react.css";
import { BigPlayButton, Player } from "video-react";

type PropsType = {
  videoUrl: string;
};

const VideoPlayer = ({ videoUrl }: PropsType) => {
  const playerRef = useRef<any>(null);

  //   const handleToggleFullscreen = () => {
  //     if (playerRef.current) {
  //       playerRef.current.toggleFullscreen();
  //       playerRef.current.play();
  //     }
  //   };
  return (
    <>
      <Player
        ref={playerRef}
        autoPlay={false}
        fluid
        playsInline
        // poster="/assets/poster.png"
        src={videoUrl}
      >
        <BigPlayButton position="center" />
      </Player>
    </>
  );
};

export default VideoPlayer;
