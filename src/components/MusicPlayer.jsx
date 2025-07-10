import { useState, useRef, useEffect } from 'react'

const MusicPlayer = ({ playlist }) => {
  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

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

  const currentItem = playlist[currentTrack]

  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen w-full">
      <video
        ref={videoRef}
        src={currentItem.video}
        loop
        muted
        playsInline
        controls={false}
        autoPlay
        onContextMenu={(e) => e.preventDefault()}
        className={currentItem.videoClass || "w-[90%] md:w-[50%]"}
      />

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
          <p className="text-blue-400 text-lg font-semibold">{currentItem.title}</p>
          <p className="text-gray-400 text-sm">At {currentItem.location}</p>
          <p className="text-gray-300 text-sm">Room by: <span className="text-blue-400 font-medium">{currentItem.roomBy}</span></p>
          <a href={currentItem.link} className="text-blue-400 hover:text-blue-300 text-sm underline transition-colors">{currentItem.link}</a>
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
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 transition-colors shadow-lg"
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