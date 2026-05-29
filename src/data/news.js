// ──────────────────────────────────────────────────────────────
// 정적 샘플 데이터 (Supabase 연동 전 임시 사용)
//
// Supabase news 테이블의 컬럼 구조와 동일하게 맞춰져 있습니다.
// 실제 연동 시 이 파일 대신 src/services/newsService.js의
// Supabase 쿼리 함수를 활성화하면 됩니다.
// ──────────────────────────────────────────────────────────────

export const NEWS = [
  {
    id: '1',
    category: '공지',
    title: '2026년 5월 교회 행사 안내',
    summary: '이번 달 진행되는 교회 행사 일정을 안내해 드립니다. 많은 참여 바랍니다.',
    content: '',
    tags: ['#교회행사', '#5월공지'],
    image_url: null,
    published: true,
    created_at: '2026-05-01T09:00:00+09:00',
  },
  {
    id: '2',
    category: '예배',
    title: '어린이 주일 특별 예배 안내',
    summary: '5월 첫째 주 주일에는 어린이 주일을 맞아 특별 예배를 드립니다.',
    content: '',
    tags: ['#어린이주일', '#특별예배'],
    image_url: null,
    published: true,
    created_at: '2026-04-28T09:00:00+09:00',
  },
  {
    id: '3',
    category: '봉사',
    title: '지역사회 섬김 봉사 모집',
    summary: '지역사회를 섬기는 봉사 팀원을 모집합니다. 관심 있는 성도는 교회로 연락해 주세요.',
    content: '',
    tags: ['#봉사', '#지역섬김'],
    image_url: null,
    published: true,
    created_at: '2026-04-20T09:00:00+09:00',
  },
  {
    id: '4',
    category: '교육',
    title: '성경 공부 새 학기 시작',
    summary: '2분기 성경 공부 과정이 시작됩니다. 등록을 원하시는 분은 사무실로 문의하세요.',
    content: '',
    tags: ['#성경공부', '#교육'],
    image_url: null,
    published: true,
    created_at: '2026-04-15T09:00:00+09:00',
  },
  {
    id: '5',
    category: '공지',
    title: '주차 안내 변경',
    summary: '교회 주차 공간 배정이 변경되었습니다. 새로운 안내문을 확인해 주세요.',
    content: '',
    tags: ['#주차안내'],
    image_url: null,
    published: true,
    created_at: '2026-04-10T09:00:00+09:00',
  },
  {
    id: '6',
    category: '선교',
    title: '해외 선교 기도회 안내',
    summary: '파송 선교사님들을 위한 합심 기도회가 진행됩니다. 함께 기도해 주세요.',
    content: '',
    tags: ['#선교', '#기도회'],
    image_url: null,
    published: true,
    created_at: '2026-04-05T09:00:00+09:00',
  },
]
