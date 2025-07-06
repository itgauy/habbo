import seaside from '../assets/seaside.mp4'
import musicFile from '../assets/blue.mp3'
import { useState, useRef } from 'react'

const Home = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  const togglePlay = async () => {
    if (videoRef.current && audioRef.current) {
      try {
        if (isPlaying) {
          videoRef.current.pause()
          audioRef.current.pause()
          setIsPlaying(false)
        } else {
          await videoRef.current.play()
          await audioRef.current.play()
          setIsPlaying(true)
        }
      } catch (error) {
        console.error('Error playing media:', error)
      }
    }
  }

  return (
    <div className="bg-black flex flex-col items-center justify-center min-h-screen w-full">
      <video
        ref={videoRef}
        src={seaside}
        loop
        muted
        playsInline
        controls={false}
        onContextMenu={(e) => e.preventDefault()}
        className="w-[90%] md:w-[50%] mb-8"
      />

      <audio
        ref={audioRef}
        src={musicFile}
        loop
        preload="auto"
      />

      {/* Music Player UI */}
      <div className="w-[90%] md:w-[50%] shadow-lg">
        {/* Song Info */}
        <div className="text-center mb-4">
          <h1 className="text-white text-xl font-bold mb-1">Now Playing</h1>
          <p className="text-blue-400 text-lg font-semibold">Blue by Yung Kai</p>
          <p className="text-gray-400 text-sm">At Seaside Tambayan</p>
        </div>

        {/* Control */}
        <div className="flex justify-center items-center">
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
        </div>
      </div>
    </div>
  )
}

export default Home