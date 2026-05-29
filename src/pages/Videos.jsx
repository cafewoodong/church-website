import PageHeader from '../components/PageHeader'
import VideoSection from '../components/VideoSection'

export default function Videos() {
  return (
    <>
      <PageHeader
        title="설교 영상"
        subtitle="광교우리동네교회의 예배와 말씀을 영상으로 함께하실 수 있습니다."
      />
      <VideoSection full />
    </>
  )
}
