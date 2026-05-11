export const ALL_CATEGORIES = [
  'AI', 'UIUX 디자인', '디자인 시스템', '커머스 UX',
  'AI 디자인 워크플로우', '콘텐츠/크리에이터', '뉴스/시장 흐름', '디자이너 커리어',
];

export const SAMPLE_ARTICLES = [
  {
    id: 'a01', title: 'AI-readable Design System은 왜 필요한가',
    url: '', source: '서핏', savedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    categories: ['디자인 시스템', 'AI'], tags: ['AI-readable DS', 'Figma MCP', '디자인 자동화'],
    summary: 'AI가 디자인 시스템을 직접 읽고 활용하기 위해서는 토큰·컴포넌트·문서가 기계가 해석 가능한 구조로 정의되어야 한다.',
    score: 82, reviewCount: 2, lastReviewedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    questions: [
      { id: 'q01a', type: '핵심 요약', q: 'AI-readable DS의 핵심 주장을 한 문장으로 정리하면?' },
      { id: 'q01b', type: '업무 적용', q: 'VLLO 디자인 시스템에 적용한다면 어디서부터 시작할까?' },
    ],
  },
  {
    id: 'a02', title: 'pSEO: 페이지를 자동으로 만들면 검색은 따라온다',
    url: '', source: '브런치', savedAt: new Date(Date.now() - 86400000).toISOString(),
    categories: ['커머스 UX'], tags: ['pSEO', '상세페이지 자동화', '커머스'],
    summary: 'programmatic SEO는 템플릿과 데이터를 결합해 수천 개의 페이지를 자동 생성하고 롱테일 검색 트래픽을 끌어온다.',
    score: 74, reviewCount: 1, lastReviewedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    questions: [
      { id: 'q02a', type: '핵심 요약', q: 'SEO와 pSEO의 결정적 차이는 무엇인가?' },
      { id: 'q02b', type: '업무 적용', q: '상세페이지 자동화에 적용 가능한 부분은?' },
    ],
  },
  {
    id: 'a03', title: 'Figma MCP — 디자인 자산을 모델 컨텍스트로',
    url: '', source: 'Figma Blog', savedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    categories: ['디자인 시스템', 'AI 디자인 워크플로우'], tags: ['Figma MCP', 'AI 워크플로우'],
    summary: 'Figma MCP 서버는 디자인 파일·라이브러리를 모델이 직접 조회할 수 있게 만들어 코드 생성 품질을 높인다.',
    score: 88, reviewCount: 3, lastReviewedAt: new Date(Date.now() - 86400000).toISOString(),
    questions: [
      { id: 'q03a', type: '핵심 요약', q: 'Figma MCP가 기존 워크플로우와 다른 점은?' },
      { id: 'q03b', type: '업무 적용', q: 'MCP가 디자이너 역할에 어떤 변화를 줄까?' },
    ],
  },
  {
    id: 'a04', title: '쿠폰 구조가 정교해진다 — PDP/PLP의 가격 표현',
    url: '', source: '회사 기술 블로그', savedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    categories: ['커머스 UX'], tags: ['쿠폰', 'PDP', 'PLP', '가격 표현'],
    summary: '조건부 쿠폰·중첩 가능성·기간 제한이 UI 표현 방식을 결정하며 가격 정렬과 신뢰도의 관계가 중요하다.',
    score: 71, reviewCount: 1, lastReviewedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    questions: [
      { id: 'q04a', type: '핵심 요약', q: '쿠폰 중첩을 보여주는 가장 명확한 UI 패턴은?' },
      { id: 'q04b', type: '업무 적용', q: '현재 서비스의 가격 표현에서 개선할 수 있는 점은?' },
    ],
  },
  {
    id: 'a05', title: 'AI는 디자이너의 결과물보다 사고를 바꾼다',
    url: '', source: '뉴스레터', savedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    categories: ['AI', 'UIUX 디자인'], tags: ['디자이너 역할', 'AI 사고', '검증 프로세스'],
    summary: 'AI는 디자이너의 산출물 속도보다 문제 정의·검증·의사결정 구조에 더 큰 영향을 미친다.',
    score: 65, reviewCount: 1, lastReviewedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    questions: [
      { id: 'q05a', type: '핵심 요약', q: 'AI가 디자이너 사고에 영향을 주는 3단계는?' },
      { id: 'q05b', type: '업무 적용', q: '내 일상 업무에서 사고 단계가 바뀐 지점은?' },
    ],
  },
  {
    id: 'a06', title: 'Claude Design — 대화로 만드는 인터페이스',
    url: '', source: '서핏', savedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    categories: ['AI', 'AI 디자인 워크플로우'], tags: ['Claude', '대화형 UI 생성'],
    summary: '대화로 디자인을 빠르게 생성·수정하는 워크플로우. 디자이너는 결과보다 프롬프트와 의도 설계에 집중한다.',
    score: 80, reviewCount: 2, lastReviewedAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    questions: [
      { id: 'q06a', type: '핵심 요약', q: '의도 중심 워크플로우가 결과 중심과 다른 점은?' },
      { id: 'q06b', type: '업무 적용', q: 'Claude Design을 업무에 도입했을 때 첫 번째 실험은?' },
    ],
  },
];
