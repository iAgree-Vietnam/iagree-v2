"use client"

import type React from "react"
import { X, ChevronLeft, ChevronRight, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react"
import { Button, Slider } from "antd"
import { useState, useRef, useEffect } from "react"

interface VideoViewerProps {
  videos: Array<{
    id: string
    name: string
    url: string
    size: number
    duration?: number
  }>
  currentIndex: number
  isOpen: boolean
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
  onVideoSelect: (index: number) => void
}

export const VideoViewer: React.FC<VideoViewerProps> = ({
  videos,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  onVideoSelect,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.load()
      setIsPlaying(false)
      setCurrentTime(0)
    }
  }, [isOpen, currentIndex])

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleSeek = (value: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const handleVolumeChange = (value: number) => {
    if (videoRef.current) {
      videoRef.current.volume = value
      setVolume(value)
      setIsMuted(value === 0)
    }
  }

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume
        setIsMuted(false)
      } else {
        videoRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        videoRef.current.requestFullscreen()
        setIsFullscreen(true)
      } else {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
    }
  }

  if (!isOpen || videos.length === 0) return null

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.9)",
        zIndex: 1000,
        display: "flex",
      }}
      onClick={onClose}
    >
      {/* Left sidebar - Video list */}
      <div
        style={{
          width: "300px",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          padding: "20px",
          overflowY: "auto",
          borderRight: "1px solid rgba(255, 255, 255, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ color: "white", fontSize: "16px", fontWeight: "bold", marginBottom: "16px" }}>
          Video ({videos.length})
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {videos.map((video, index) => (
            <div
              key={video.id}
              style={{
                cursor: "pointer",
                border: index === currentIndex ? "2px solid #722ed1" : "2px solid transparent",
                borderRadius: "8px",
                overflow: "hidden",
                transition: "border-color 0.2s ease",
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                padding: "12px",
              }}
              onClick={() => onVideoSelect(index)}
            >
              <div style={{ color: "white", fontSize: "14px", fontWeight: "500", marginBottom: "4px" }}>
                {video.name}
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: "12px" }}>
                {formatFileSize(video.size)}
                {video.duration && ` • ${formatTime(video.duration)}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side - Main video viewer */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "20px",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "4px" }}>
              {videos[currentIndex]?.name}
            </div>
            <div style={{ fontSize: "14px", opacity: 0.7 }}>
              {currentIndex + 1} / {videos.length} • {formatFileSize(videos[currentIndex]?.size || 0)}
            </div>
          </div>
          <Button
            type="text"
            shape="circle"
            icon={<X size={24} />}
            onClick={onClose}
            style={{
              color: "white",
              border: "none",
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              width: "48px",
              height: "48px",
            }}
          />
        </div>

        {/* Main video container */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            padding: "20px 80px",
            minHeight: 0,
          }}
        >
          <video
            ref={videoRef}
            src={videos[currentIndex]?.url}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
            }}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />

          {/* Previous button */}
          {videos.length > 1 && (
            <Button
              type="text"
              shape="circle"
              icon={<ChevronLeft size={24} />}
              onClick={onPrevious}
              style={{
                position: "absolute",
                left: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                border: "none",
                width: "48px",
                height: "48px",
                transition: "background-color 0.2s ease",
              }}
              disabled={currentIndex === 0}
            />
          )}

          {/* Next button */}
          {videos.length > 1 && (
            <Button
              type="text"
              shape="circle"
              icon={<ChevronRight size={24} />}
              onClick={onNext}
              style={{
                position: "absolute",
                right: "20px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "white",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                border: "none",
                width: "48px",
                height: "48px",
                transition: "background-color 0.2s ease",
              }}
              disabled={currentIndex === videos.length - 1}
            />
          )}
        </div>

        {/* Video controls */}
        <div
          style={{
            padding: "20px",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
          }}
        >
          {/* Progress bar */}
          <div style={{ marginBottom: "16px" }}>
            <Slider
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSeek}
              tooltip={{
                formatter: (value) => formatTime(value || 0),
              }}
              style={{
                margin: 0,
              }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginTop: "4px" }}>
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Control buttons */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <Button
                type="text"
                shape="circle"
                icon={<RotateCcw size={20} />}
                onClick={handleRestart}
                style={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                }}
              />
              <Button
                type="text"
                shape="circle"
                icon={isPlaying ? <Pause size={20} /> : <Play size={20} />}
                onClick={handlePlayPause}
                style={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  width: "48px",
                  height: "48px",
                }}
              />
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              {/* Volume control */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: "120px" }}>
                <Button
                  type="text"
                  shape="circle"
                  icon={isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  onClick={handleMuteToggle}
                  style={{
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    border: "none",
                  }}
                />
                <Slider
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  style={{ flex: 1, margin: 0 }}
                />
              </div>

              <Button
                type="text"
                shape="circle"
                icon={<Maximize size={20} />}
                onClick={handleFullscreen}
                style={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  border: "none",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
