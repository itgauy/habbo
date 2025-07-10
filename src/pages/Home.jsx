import MusicPlayer from '../components/MusicPlayer'
import { Seaside, Sunset } from './videos'
import { Blue, BOAF } from './audios'

const Home = () => {
  const playlist = [
    {
      title: "'Blue' by Yung Kai",
      location: "Seaside Tambayan",
      roomBy: "sudo",
      link: "https://habba.io",
      video: Seaside,
      audio: Blue,
      uiColor: {
        primary: "blue",
        accent: "blue"
      }
    },
    {
      title: "'Birds of A Feather' by Billie Eilish",
      location: "Sunset Vibes",
      roomBy: "coqueto",
      link: "https://www.habboon.pw",
      video: Sunset,
      audio: BOAF,
      uiColor: {
        primary: "purple",
        accent: "pink"
      }
    }
  ]

  return <MusicPlayer playlist={playlist} />
}

export default Home