import { useEffect, useRef, useState } from "react";
import { useUpdateProgress } from "@/hooks/useProgress";
import { Button } from "./ui/button";
import { Play, Pause } from "lucide-react";

interface VideoPlayerProps {
  lessonId: string;
  videoUrl: string;
  initialProgress?: number;
  onComplete?: () => void;
}

export const VideoPlayer = ({ lessonId, videoUrl, initialProgress = 0, onComplete }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(initialProgress);
  const updateProgress = useUpdateProgress();
  const lastSavedTime = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (initialProgress > 0) {
      video.currentTime = initialProgress;
    }

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      setCurrentTime(current);

      // Auto-save every 5 seconds
      if (Math.abs(current - lastSavedTime.current) >= 5) {
        updateProgress.mutate({
          lessonId,
          progressSeconds: Math.floor(current),
          videoDuration: Math.floor(video.duration),
        });
        lastSavedTime.current = current;
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    const handleEnded = () => {
      updateProgress.mutate({
        lessonId,
        progressSeconds: Math.floor(video.duration),
        videoDuration: Math.floor(video.duration),
      });
      onComplete?.();
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("ended", handleEnded);
    };
  }, [lessonId, initialProgress, updateProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  return (
    <div className="relative w-full aspect-video bg-muted rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        controls
      />
      {!videoUrl && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Button onClick={togglePlay} size="lg" className="rounded-full w-16 h-16">
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
          </Button>
        </div>
      )}
    </div>
  );
};
