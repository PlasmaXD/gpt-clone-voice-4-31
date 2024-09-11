import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw } from "lucide-react";

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const restart = () => {
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  return (
    <div className="flex items-center space-x-2">
      <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
      <Button onClick={togglePlayPause} variant="outline" size="icon">
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </Button>
      <Button onClick={restart} variant="outline" size="icon">
        <RotateCcw className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AudioPlayer;