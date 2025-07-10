import { useState, useRef, useEffect } from 'react'

const MusicPlayer = ({ playlist }) => {
  // Get initial track from URL params
  const getInitialTrack = () => {
    const urlParams = new URLSearchParams(window.location.search)
    const trackParam = urlParams.get('track')
    if (trackParam) {
      const trackIndex = parseInt(trackParam) - 1 // Convert to 0-based index
      if (trackIndex >= 0 && trackIndex < playlist.length) {
        return trackIndex
      }
    }
    return 0
  }

  const [currentTrack, setCurrentTrack] = useState(getInitialTrack())
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  // Update URL when track changes
  useEffect(() => {
    const newUrl = new URL(window.location)
    newUrl.searchParams.set('track', (currentTrack + 1).toString())
    window.history.replaceState({}, '', newUrl)
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current

    const handleAudioEnd = () => {
      const nextIndex = (currentTrack + 1) % playlist.length
      setCurrentTrack(nextIndex)

      // Auto-play the next track
      setTimeout(async () => {
        if (audioRef.current) {
          try {
            await audioRef.current.play()
            setIsPlaying(true)
          } catch (error) {
            console.error('Error auto-playing next track:', error)
          }
        }
      }, 100)
    }

    if (audio) {
      audio.addEventListener('ended', handleAudioEnd)

      return () => {
        audio.removeEventListener('ended', handleAudioEnd)
      }
    }
  }, [currentTrack, playlist.length])

  // Reset video loaded state when track changes
  useEffect(() => {
    setIsVideoLoaded(false)
  }, [currentTrack])

  const handleVideoLoad = () => {
    setIsVideoLoaded(true)
  }

  const togglePlay = async () => {
    if (videoRef.current && audioRef.current) {
      try {
        if (isPlaying) {
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Error playing media:', error)
      }
    }
  }

  const nextTrack = async () => {
    const newIndex = (currentTrack + 1) % playlist.length
    await changeTrack(newIndex)
  }

  const prevTrack = async () => {
    const newIndex = currentTrack === 0 ? playlist.length - 1 : currentTrack - 1
    await changeTrack(newIndex)
  }

  const changeTrack = async (newIndex) => {
    const wasPlaying = isPlaying

    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }

    setCurrentTrack(newIndex)

    setTimeout(async () => {
      if (wasPlaying && audioRef.current) {
        try {
          await audioRef.current.play()
          setIsPlaying(true)
        } catch (error) {
          console.error('Error playing new track:', error)
        }
      }
    }, 100)
  }

  // Color mapping for UI elements
  const colorMap = {
    blue: {
      primary: 'text-blue-400',
      primaryHover: 'hover:text-blue-300',
      button: 'bg-blue-500',
      buttonHover: 'hover:bg-blue-600',
      accent: 'text-blue-400',
      loading: 'border-t-blue-600'
    },
    purple: {
      primary: 'text-purple-400',
      primaryHover: 'hover:text-purple-300',
      button: 'bg-purple-500',
      buttonHover: 'hover:bg-purple-600',
      accent: 'text-purple-400',
      loading: 'border-t-purple-600'
    },
    pink: {
      primary: 'text-pink-400',
      primaryHover: 'hover:text-pink-300',
      button: 'bg-pink-500',
      buttonHover: 'hover:bg-pink-600',
      accent: 'text-pink-400',
      loading: 'border-t-pink-600'
    },
    green: {
      primary: 'text-green-400',
      primaryHover: 'hover:text-green-300',
      button: 'bg-green-500',
      buttonHover: 'hover:bg-green-600',
      accent: 'text-green-400',
      loading: 'border-t-green-600'
    }
  }

  const currentItem = playlist[currentTrack]
  const uiColors = currentItem.uiColor || { primary: "blue", accent: "blue" }
  const primaryColors = colorMap[uiColors.primary] || colorMap.blue
  const accentColors = colorMap[uiColors.accent] || colorMap.blue

  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen w-full">
      {/* Fixed Video Container */}
      <div className="relative mb-8 w-[90%] md:w-[60%] h-[400px] md:h-[500px] rounded-lg overflow-hidden flex items-center justify-center">
        {/* Loading Skeleton */}
        {!isVideoLoaded && (
          <div className={`absolute inset-0 rounded-lg animate-pulse flex items-center justify-center`}>
            <div className="flex flex-col items-center justify-center">
              <div className={`w-16 h-16 border-4 border-gray-600 ${primaryColors.loading} rounded-full animate-spin mb-4`}></div>
              <p className="text-gray-400 text-sm">Loading video...</p>
            </div>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          src={currentItem.video}
          loop
          muted
          playsInline
          controls={false}
          autoPlay
          onContextMenu={(e) => e.preventDefault()}
          onLoadedData={handleVideoLoad}
          onCanPlay={handleVideoLoad}
          className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
        />
      </div>

      <audio
        ref={audioRef}
        src={currentItem.audio}
        preload="auto"
      />

      {/* Music Player UI */}
      <div className="w-[90%] md:w-[50%] shadow-lg">
        {/* Song Info */}
        <div className="text-center mb-4">
          <h1 className="text-white text-xl font-bold mb-1">Now Playing</h1>
          <p className={`${primaryColors.primary} text-lg font-semibold`}>{currentItem.title}</p>
          <p className="text-gray-400 text-sm">At {currentItem.location}</p>
          <p className="text-gray-300 text-sm">Room by: <span className={`${accentColors.accent} font-medium`}>{currentItem.roomBy}</span></p>
          <a href={currentItem.link} className={`${primaryColors.primary} ${primaryColors.primaryHover} text-sm underline transition-colors`}>{currentItem.link}</a>
        </div>

        {/* Controls */}
        <div className="flex justify-center items-center gap-4">
          <button
            onClick={prevTrack}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-3 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
            </svg>
          </button>

          <button
            onClick={togglePlay}
            className={`${primaryColors.button} ${primaryColors.buttonHover} text-white rounded-full p-4 transition-colors shadow-lg`}
          >
            {isPlaying ? (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={nextTrack}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-full p-3 transition-colors shadow-lg"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
            </svg>
          </button>
        </div>

        {/* Track indicator */}
        <div className="flex justify-center mt-4">
          <span className="text-gray-400 text-sm">
            {currentTrack + 1} / {playlist.length}
          </span>
        </div>
      </div>
    </div>
  )
}

export default MusicPlayer