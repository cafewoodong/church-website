import Hero from '../components/Hero'
import VideoSection from '../components/VideoSection'
import WorshipInfo from '../components/WorshipInfo'
import NewsSection from '../components/NewsSection'
import LocationSection from '../components/LocationSection'

export default function Home() {
  return (
    <>
      <Hero />
      <VideoSection />
      <WorshipInfo />
      <NewsSection limit={3} />
      <LocationSection />
    </>
  )
}
