'use client'

import React, { useEffect, useRef, useState } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  url: string
  format: string
  poster?: string
  clientEmail: string
}

export default function VideoPlayer({ url, format, poster, clientEmail }: VideoPlayerProps) {
  const videoContainerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null)

  const [watermarkPos, setWatermarkPos] = useState({ top: '20%', left: '20%' })
  const [currentTimeStr, setCurrentTimeStr] = useState('')

  // 1. Initialize and dispose Video.js Player
  useEffect(() => {
    if (!videoRef.current) return

    const playerOptions = {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      poster: poster || '',
      sources: [
        {
          src: url,
          type: format === 'hls' ? 'application/x-mpegURL' : 'video/mp4',
        },
      ],
      controlBar: {
        // Disable Picture-In-Picture & native download button
        pictureInPictureToggle: false,
        remainingTimeDisplay: {
          displayNegative: false,
        },
      },
      userActions: {
        doubleClick: true,
      },
    }

    const player = playerRef.current = videojs(videoRef.current, playerOptions, () => {
      // Player is ready
    })

    // Custom overlay to prevent downloading
    player.ready(() => {
      const tech = player.tech({ IWillNotUseThisInApp: true })
      if (tech && tech.el()) {
        tech.el().setAttribute('controlsList', 'nodownload')
        tech.el().setAttribute('disablePictureInPicture', 'true')
      }
    })

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose()
        playerRef.current = null
      }
    }
  }, [url, format, poster])

  // 2. Dynamic Floating Watermark position changing every 8 seconds
  useEffect(() => {
    const changePosition = () => {
      const randomTop = Math.floor(Math.random() * 70) + 10 // 10% to 80%
      const randomLeft = Math.floor(Math.random() * 60) + 10 // 10% to 70%
      setWatermarkPos({ top: `${randomTop}%`, left: `${randomLeft}%` })
    }

    changePosition()
    const timer = setInterval(changePosition, 8000)
    return () => clearInterval(timer)
  }, [])

  // 3. Live watermark timestamp updates every 1 second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setCurrentTimeStr(now.toISOString().replace('T', ' ').substring(0, 19))
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div 
      className="video-player-outer-wrapper"
      ref={videoContainerRef}
      onContextMenu={(e) => e.preventDefault()} // Disable right click
    >
      <div data-vjs-player>
        <video 
          ref={videoRef} 
          className="video-js vjs-big-play-centered vjs-theme-city"
        />
      </div>

      {/* Floating Anti-Theft Watermark Overlay */}
      {clientEmail && (
        <div 
          className="video-watermark-overlay"
          style={{
            position: 'absolute',
            top: watermarkPos.top,
            left: watermarkPos.left,
            pointerEvents: 'none', // Allow clicking through it to control video
            zIndex: 30,
            color: 'rgba(244, 217, 156, 0.35)',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.9)',
            fontFamily: 'monospace',
            fontSize: 'clamp(11px, 1.5vw, 15px)',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            transition: 'top 0.8s ease-in-out, left 0.8s ease-in-out',
            userSelect: 'none',
          }}
        >
          {clientEmail} <br />
          {currentTimeStr}
        </div>
      )}
    </div>
  )
}
