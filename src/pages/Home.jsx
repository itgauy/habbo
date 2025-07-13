import MusicPlayer from '../components/MusicPlayer'
import { Seaside, Sunset, etivac } from './videos'
import { Blue, BOAF, yoasobi } from './audios'

const Home = () => {
  const playlist = [
    {
      title: "'Blue' by Yung Kai",
      location: "Seaside Tambayan",
      roomBy: "sudo (me)",
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
      roomBy: "coqueto (me)",
      link: "https://www.habboon.pw",
      video: Sunset,
      audio: BOAF,
      uiColor: {
        primary: "purple",
        accent: "pink"
      }
    },
    {
      title: "'Racing Into The Night' by YOASOBI",
      location: "Etivac Canals",
      roomBy: "Warriuz",
      link: "https://www.habbo.com",
      video: etivac,
      audio: yoasobi,
      uiColor: {
        primary: "brown",
        accent: "brown"
      }
    }
  ]

  return <MusicPlayer playlist={playlist} />
}

export default Home