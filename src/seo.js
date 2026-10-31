import { CHURCH_NAME } from './constants.js'

export const SITE_URL = 'https://woodong.or.kr'

export const DEFAULT_SEO = {
  siteName: CHURCH_NAME,
  title: `${CHURCH_NAME} | 수원 광교 교회`,
  description:
    '수원 영통구 광교중앙로의 광교우리동네교회입니다. 주일예배 오전 11시, 수요기도회 밤 8시 50분. 안으로는 가정교회, 밖으로는 선교적교회.',
  image: '/og-image.png',
}

/** 검색 결과·공유 미리보기에 쓰이는 페이지별 문구 */
export const PAGE_SEO = {
  about: {
    title: '교회 소개',
    description:
      '광교우리동네교회는 안으로는 가정교회, 밖으로는 선교적교회를 지향합니다. 담임목사 소개와 교회가 걸어온 길을 안내합니다.',
  },
  worship: {
    title: '예배 안내',
    description:
      '주일예배 매주 일요일 오전 11시, 수요기도회 매주 수요일 밤 8시 50분. 현장과 유튜브 온라인 라이브로 함께 예배드립니다.',
  },
  videos: {
    title: '설교 영상',
    description:
      '광교우리동네교회의 주일예배 라이브, 주일설교, 수요기도회 설교 영상을 다시 보실 수 있습니다.',
  },
  news: {
    title: '교회 소식',
    description: '광교우리동네교회의 주보와 공지사항, 교회 소식을 전합니다.',
  },
  location: {
    title: '찾아오시는 길',
    description:
      '수원특례시 영통구 광교중앙로247 상가동 202호. 광교우리동네교회 오시는 길과 주차 안내입니다.',
  },
  giving: {
    title: '온라인 헌금',
    description: '광교우리동네교회 온라인 헌금 계좌를 안내합니다.',
  },
}
