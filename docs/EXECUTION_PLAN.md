# MVP 실행 계획 (Execution Plan)

> 버전: 1.0
> 작성일: 2025-12-14
> 관련 문서: [PRD](./PRD.md)

---

## 개요

Daily Scrum Timer MVP 구현을 위한 단계별 실행 계획입니다.
각 작업은 체크박스로 완료 여부를 트래킹할 수 있습니다.

**예상 작업 단위:** 총 8개 Sprint (각 Sprint는 논리적 작업 단위)

---

## Sprint 1: 프로젝트 초기 설정

### 1.1 개발 환경 구성
- [x] Next.js 15 프로젝트 생성 (App Router, TypeScript)
- [x] Tailwind CSS 설정
- [x] shadcn/ui 초기화 및 기본 컴포넌트 설치
- [x] ESLint, Prettier 설정
- [x] 프로젝트 구조 설계 (폴더 구조)

### 1.2 상태 관리 설정
- [x] Zustand 설치 및 설정
- [x] persist 미들웨어 설정 (localStorage)
- [x] 기본 store 구조 생성

### 1.3 기본 레이아웃
- [x] 메인 레이아웃 컴포넌트 생성
- [x] 헤더 컴포넌트 (로고, 다크모드 토글, 설정 버튼)
- [x] 반응형 컨테이너 설정

**완료 기준:** 프로젝트가 로컬에서 정상 실행되고, 기본 레이아웃이 표시됨

---

## Sprint 2: 다크모드 및 테마 시스템

### 2.1 테마 구현
- [x] next-themes 또는 자체 테마 시스템 구현
- [x] 다크/라이트 모드 CSS 변수 정의
- [x] Tailwind dark mode 설정

### 2.2 테마 토글
- [x] 헤더에 다크모드 토글 버튼 추가
- [x] 테마 상태 Zustand store에 저장
- [x] localStorage에 테마 설정 persist

**완료 기준:** 다크모드 토글이 동작하고, 새로고침 후에도 테마 유지

---

## Sprint 3: 팀원 관리 기능

### 3.1 팀원 데이터 모델
- [x] Member 타입 정의 (id, name, isOnVacation, isCompleted)
- [x] Zustand store에 members 상태 추가
- [x] CRUD 액션 구현 (addMember, removeMember, toggleVacation)

### 3.2 팀원 목록 UI
- [x] MemberList 컴포넌트 생성
- [x] MemberItem 컴포넌트 (이름, 휴가 토글, 삭제 버튼)
- [x] 상태별 아이콘 표시 (완료 ✅, 진행중 🔴, 대기 ⏳, 휴가 🏖️)

### 3.3 팀원 추가 기능
- [x] 이름 입력 필드 (목록 상단에 배치)
- [x] 추가 버튼 및 Enter 키 지원
- [x] 빈 이름 방지 validation

### 3.4 데이터 영속성
- [x] 팀원 목록 localStorage 저장
- [x] 새로고침 시 데이터 복원 확인

**완료 기준:** 팀원 추가/삭제/휴가 설정이 동작하고, 새로고침 후에도 데이터 유지

---

## Sprint 4: 원형 타이머 UI

### 4.1 타이머 컴포넌트 구조
- [ ] CircularTimer 컴포넌트 생성
- [ ] SVG 기반 원형 프로그레스 바 구현
- [ ] 중앙 시간 표시 (MM:SS 형식)

### 4.2 프로그레스 애니메이션
- [ ] Motion (Framer Motion) 설치 및 설정
- [ ] 프로그레스 바 애니메이션 구현
- [ ] 부드러운 카운트다운 효과

### 4.3 색상 변화 시스템
- [ ] 시간 비율에 따른 색상 계산 로직
  - 100%~50%: 녹색 (#22c55e)
  - 50%~20%: 노란색 (#eab308)
  - 20%~0%: 빨간색 (#ef4444)
- [ ] 색상 전환 애니메이션

**완료 기준:** 원형 타이머가 시각적으로 완성되고, 색상이 시간에 따라 변함

---

## Sprint 5: 타이머 로직 및 컨트롤

### 5.1 타이머 상태 관리
- [ ] Zustand store에 타이머 상태 추가
  - timeLeft, totalTime, isRunning, isPaused
- [ ] setInterval 기반 카운트다운 로직
- [ ] 타이머 정확도 최적화 (drift 보정)

### 5.2 컨트롤 버튼
- [ ] 시작/일시정지 버튼 (토글)
- [ ] +30초 연장 버튼
- [ ] 다음 사람 버튼
- [ ] 리셋 버튼
- [ ] 버튼 상태별 스타일링 (활성/비활성)

### 5.3 미팅 흐름 제어
- [ ] 순서 셔플 버튼 (Fisher-Yates 알고리즘)
- [ ] 미팅 시작 버튼 (현재 순서 유지)
- [ ] 미팅 진행 상태 관리 (대기/진행중/완료)

**완료 기준:** 타이머가 정확하게 동작하고, 모든 컨트롤 버튼이 기능함

---

## Sprint 6: 발표자 표시 시스템

### 6.1 현재/다음 발표자 UI
- [ ] SpeakerDisplay 컴포넌트 생성
- [ ] 현재 발표자: 크고 강조된 스타일
- [ ] 다음 발표자: 작고 흐린 스타일 (opacity 50-70%)
- [ ] 타이머 상단에 배치

### 6.2 발표자 진행 로직
- [ ] 현재 발표자 인덱스 관리
- [ ] 다음 사람으로 넘어가기 로직
- [ ] 휴가자 자동 스킵
- [ ] 마지막 발표자 처리 (미팅 완료)

### 6.3 팀원 목록 상태 동기화
- [ ] 현재 발표자 하이라이트 (🔴)
- [ ] 완료된 발표자 표시 (✅)
- [ ] 대기 중인 발표자 표시 (⏳)

**완료 기준:** 발표자 정보가 명확하게 표시되고, 진행 흐름이 자연스러움

---

## Sprint 7: 알림 시스템

### 7.1 오디오 설정
- [ ] use-sound 라이브러리 설치
- [ ] 경고음 파일 준비 (10초 알림용)
- [ ] 완료 알림음 파일 준비

### 7.2 알림 로직
- [ ] 10초 남았을 때 경고음 재생
- [ ] 0초 (시간 종료) 시 완료 알림음 재생
- [ ] 알림음 중복 재생 방지

### 7.3 시각적 알림
- [ ] 시간 종료 시 애니메이션 효과
- [ ] "OOO님 준비하세요!" 메시지 표시
- [ ] 화면 깜빡임 또는 펄스 효과

### 7.4 설정 연동
- [ ] 소리 On/Off 설정 반영
- [ ] 브라우저 autoplay 정책 대응 (사용자 인터랙션 후 활성화)

**완료 기준:** 10초 경고음과 종료 알림이 정상 동작, 시각적 피드백 제공

---

## Sprint 8: 설정 및 마무리

### 8.1 설정 모달
- [ ] 설정 모달 컴포넌트 생성
- [ ] 기본 시간 조정 (30초 ~ 5분, 드롭다운 또는 슬라이더)
- [ ] 연장 시간 단위 설정 (15초/30초/1분)
- [ ] 소리 알림 On/Off 토글
- [ ] 10초 경고음 On/Off 토글

### 8.2 설정 영속성
- [ ] 설정값 Zustand store 저장
- [ ] localStorage persist

### 8.3 UI/UX 마무리
- [ ] 전체 레이아웃 정리
- [ ] 반응형 디자인 확인
- [ ] 접근성 검토 (키보드 네비게이션, aria 속성)
- [ ] 에러 상태 처리

### 8.4 배포
- [ ] Vercel 프로젝트 생성
- [ ] 환경 변수 설정 (필요시)
- [ ] 프로덕션 빌드 테스트
- [ ] 배포 및 URL 확인

**완료 기준:** 모든 MVP 기능이 동작하고, 프로덕션 환경에 배포됨

---

## 작업 우선순위 요약

| 순서 | Sprint | 핵심 내용 | 의존성 |
|------|--------|----------|--------|
| 1 | Sprint 1 | 프로젝트 초기 설정 | 없음 |
| 2 | Sprint 2 | 다크모드/테마 | Sprint 1 |
| 3 | Sprint 3 | 팀원 관리 | Sprint 1 |
| 4 | Sprint 4 | 원형 타이머 UI | Sprint 1 |
| 5 | Sprint 5 | 타이머 로직 | Sprint 3, 4 |
| 6 | Sprint 6 | 발표자 표시 | Sprint 5 |
| 7 | Sprint 7 | 알림 시스템 | Sprint 5 |
| 8 | Sprint 8 | 설정 및 배포 | Sprint 6, 7 |

---

## 진행 상황 트래킹

### 전체 진행률

| Sprint | 상태 | 완료일 |
|--------|------|--------|
| Sprint 1 | ✅ 완료 | 2025-12-14 |
| Sprint 2 | ✅ 완료 | 2025-12-14 |
| Sprint 3 | ✅ 완료 | 2025-12-14 |
| Sprint 4 | ⬜ 대기 | - |
| Sprint 5 | ⬜ 대기 | - |
| Sprint 6 | ⬜ 대기 | - |
| Sprint 7 | ⬜ 대기 | - |
| Sprint 8 | ⬜ 대기 | - |

**상태 범례:**
- ⬜ 대기
- 🔄 진행중
- ✅ 완료

---

## 기술 참고사항

### 주요 라이브러리
```bash
# 프로젝트 생성
npx create-next-app@latest daily-scrum-timer --typescript --tailwind --app

# 필수 의존성
npm install zustand framer-motion use-sound
npx shadcn@latest init
```

### 폴더 구조 (권장)
```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── ui/              # shadcn 컴포넌트
│   ├── layout/          # Header, Footer 등
│   ├── timer/           # CircularTimer, TimerControls
│   ├── member/          # MemberList, MemberItem
│   └── settings/        # SettingsModal
├── stores/
│   └── useScrumStore.ts # Zustand store
├── hooks/
│   └── useTimer.ts      # 타이머 커스텀 훅
├── lib/
│   └── utils.ts         # 유틸리티 함수
├── types/
│   └── index.ts         # 타입 정의
└── public/
    └── sounds/          # 알림음 파일
```

---

## 리스크 및 대응

| 리스크 | 대응 방안 | 관련 Sprint |
|--------|----------|-------------|
| SVG 원형 타이머 구현 복잡 | 외부 라이브러리 검토 (react-circular-progressbar) | Sprint 4 |
| 타이머 drift 문제 | requestAnimationFrame 또는 Web Worker 검토 | Sprint 5 |
| 오디오 autoplay 차단 | 첫 인터랙션 시 AudioContext 초기화 | Sprint 7 |

---

*문서 끝*
