export const PLACEHOLDER_PLAYLIST_ID = 'PLAYLIST_ID_HERE'

export const CHURCH_NAME = '광교우리동네교회'
export const CHURCH_TAGLINE = '안으로는 가정교회, 밖으로는 선교적교회'
export const CHURCH_DESC = '말씀과 기도, 찬양으로 함께 세워져 가는 공동체입니다.'

export const CHURCH_ADDRESS = '수원특례시 영통구 광교중앙로247, 상가동 202호'
export const CHURCH_ZIPCODE = '16512'
export const CHURCH_PHONE = '010-4952-8534'
export const CHURCH_EMAIL = 'ggcommchurch@gmail.com'

export const BANK_NAME = '농협은행'
export const BANK_ACCOUNT = '301-0241-8630-310'
export const BANK_HOLDER = '기독교대한성결교회 광교우리동네교회'

export const NAV_ITEMS = [
  { label: '홈', to: '/' },
  { label: '교회소개', to: '/about' },
  { label: '예배안내', to: '/worship' },
  { label: '설교영상', to: '/videos' },
  { label: '설교블로그', href: 'https://sermon-blog.vercel.app', external: true },
  { label: '교회소식', to: '/news' },
  { label: '찾아오시는길', to: '/location' },
  { label: '온라인헌금', to: '/giving', highlight: true },
]

export const WORSHIP_SCHEDULE = [
  {
    name: '주일예배',
    time: '오전 11:00',
    day: '매주 일요일',
    desc: '현장과 온라인 라이브로 함께 예배드립니다.',
    icon: '☀️',
  },
  {
    name: '수요기도회',
    time: '밤 8:50',
    day: '매주 수요일',
    desc: '말씀과 기도로 함께하는 은혜의 시간입니다.',
    icon: '🌙',
  },
]

export const SERMON_VIDEOS = [
  { label: '주일예배라이브', playlistId: "PLOs47y4wPli_mqFbKWIaYCUhUUeMSL3Q8" },
  { label: '주일설교', playlistId: "PLOs47y4wPli-n3Vc4czs6h4plPKdox8_F" },
  { label: '수요기도회설교', playlistId: "PLOs47y4wPli8FIoerD2TSvH8xJvNWZzjN" },
]

export const WORSHIP_VIDEO_TABS = [
  { label: '주일예배', playlistId: 'PLOs47y4wPli_mqFbKWIaYCUhUUeMSL3Q8' },
  { label: '주일설교', playlistId: 'PLOs47y4wPli-n3Vc4czs6h4plPKdox8_F' },
  { label: '수요예배', playlistId: 'PLOs47y4wPli_0NVmBvi1nZ2vbucSIt-HU' },
  { label: '수요설교', playlistId: 'PLOs47y4wPli8FIoerD2TSvH8xJvNWZzjN' },
]
