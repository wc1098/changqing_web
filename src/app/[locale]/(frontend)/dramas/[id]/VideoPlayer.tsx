'use client'

import React, { useEffect, useRef } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

interface VideoPlayerProps {
  url: string
  format: string
}

export default function VideoPlayer({ url, format }: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null)

  // 1. Initialize and update Video.js Player
  useEffect(() => {
    const targetNode = containerRef.current
    if (!targetNode || !url) return

    const isHls = (format || '').toLowerCase() === 'hls' || url.includes('.m3u8')
    const mimeType = isHls ? 'application/x-mpegURL' : 'video/mp4'

    let videoElement = targetNode.querySelector('video')
    if (!videoElement) {
      videoElement = document.createElement('video')
      videoElement.className = 'video-js vjs-big-play-centered vjs-theme-city'
      videoElement.setAttribute('playsinline', 'true')
      videoElement.setAttribute('webkit-playsinline', 'true')
      targetNode.appendChild(videoElement)
    }

    if (!playerRef.current) {
      const player = playerRef.current = videojs(videoElement, {
        autoplay: false,
        controls: true,
        responsive: true,
        fill: true,
        fluid: false,
        poster: '',
        sources: [
          {
            src: url,
            type: mimeType,
          },
        ],
        controlBar: {
          pictureInPictureToggle: false,
          remainingTimeDisplay: {
            displayNegative: false,
          },
        },
        userActions: {
          doubleClick: true,
        },
      })

      player.ready(() => {
        const tech = player.tech({ IWillNotUseThisInApp: true })
        if (tech && tech.el()) {
          tech.el().setAttribute('controlsList', 'nodownload')
          tech.el().setAttribute('disablePictureInPicture', 'true')
        }
      })
    } else {
      const player = playerRef.current
      player.autoplay(false)
      player.src({ src: url, type: mimeType })
      player.poster('')
    }

    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose()
        playerRef.current = null
        if (targetNode) {
          targetNode.innerHTML = ''
        }
      }
    }
  }, [url, format])

  return (
    <div 
      className="video-player-outer-wrapper"
      onContextMenu={(e) => e.preventDefault()} // Disable right click
    >
      <div ref={containerRef} className="vjs-container-target" style={{ width: '100%', height: '100%' }} />
    </div>
  )
}
