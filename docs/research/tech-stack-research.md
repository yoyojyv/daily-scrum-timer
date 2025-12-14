# 데일리 스크럼 타이머 - 기술 조사 문서

> 작성일: 2025-12-14

## 1. 개요

데일리 스크럼 미팅에 사용할 타이머 웹 애플리케이션 개발을 위한 기술 조사 문서입니다.

### 1.1 주요 요구사항 요약

| 구분 | 기능 |
|------|------|
| **핵심(MVP)** | 타이머 (기본 1분), 팀원 관리, 랜덤 순서, 휴가자 제외, 시간 연장(+30초), 알림 소리, 애니메이션 |
| **부가** | 음성 인식 기록, AI 요약, 화면 공유, 펜 드로잉 |

---

## 2. 프론트엔드 프레임워크

### 2.1 Next.js 15 + React 19

**선정 이유:**
- SSR/SSG 지원으로 빠른 초기 로딩
- App Router로 현대적인 라우팅 패턴
- Server Components로 성능 최적화
- Claude Code에서 가장 잘 지원되는 스택

**참고:**
- [Next.js 공식 문서](https://nextjs.org/docs)

---

## 3. UI 프레임워크 및 스타일링

### 3.1 권장: shadcn/ui + Tailwind CSS

**shadcn/ui 장점:**
- 컴포넌트 코드를 직접 소유 → 무제한 커스터마이징
- Radix UI 기반으로 접근성(WAI-ARIA) 준수
- Tailwind CSS와 완벽 통합
- CLI로 쉬운 컴포넌트 추가

**잠재적 우려:**
- Radix UI 팀이 Base UI로 전환 → 장기 유지보수 불확실성
- 하지만 현재 가장 인기 있는 선택지

**대안:**
| 라이브러리 | 특징 |
|------------|------|
| HeroUI (구 NextUI) | Tailwind 기반, 가볍고 유연함 |
| Mantine | 풍부한 컴포넌트, 좋은 DX |
| Radix Themes | Radix 팀 공식 테마 시스템 |

**참고:**
- [shadcn/ui 공식](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 4. 애니메이션 라이브러리

### 4.1 권장: Motion (구 Framer Motion)

**선정 이유:**
- 월 1,200만 다운로드로 가장 인기 있는 React 애니메이션 라이브러리
- 선언적 API로 React와 자연스럽게 통합
- 레이아웃 애니메이션, 제스처, 스크롤 애니메이션 지원
- 하드웨어 가속으로 부드러운 성능

**주요 기능:**
- `motion.div` 컴포넌트로 간단한 애니메이션
- `AnimatePresence`로 exit 애니메이션
- 드래그 앤 드롭 한 줄로 구현 가능
- 실제 스프링 물리 적용

**v11 (2025) 업데이트:**
- React 19 동시 렌더링 호환 개선
- 레이아웃 애니메이션 신뢰성 향상
- 대량 애니메이션 요소 성능 개선

**사용 예시 - 타이머 알림:**
```tsx
<motion.div
  initial={{ scale: 0 }}
  animate={{ scale: 1 }}
  transition={{ type: "spring", stiffness: 260, damping: 20 }}
>
  시간 종료!
</motion.div>
```

**참고:**
- [Motion 공식](https://motion.dev/)
- [GitHub - motiondivision/motion](https://github.com/motiondivision/motion)

---

## 5. 오디오 알림

### 5.1 방법 1: use-sound Hook (권장)

**장점:**
- React에 최적화된 간단한 API
- Josh W. Comeau가 개발/유지보수
- 2025년 5월 업데이트로 최신 상태

**사용 예시:**
```tsx
import useSound from 'use-sound';
import alarmSound from './alarm.mp3';

function Timer() {
  const [playAlarm] = useSound(alarmSound);

  const onTimeUp = () => {
    playAlarm();
  };
}
```

### 5.2 방법 2: Web Audio API (직접 구현)

**장점:**
- 외부 의존성 없음
- 사운드 합성, 이펙트 등 고급 기능 가능

**단점:**
- 구현 복잡도 높음
- 브라우저 호환성 확인 필요

### 5.3 주의사항

- `Notification.sound`는 어떤 브라우저에서도 지원되지 않음
- 사용자 인터랙션 후에만 소리 재생 가능 (autoplay 정책)
- 알림음 파일은 프로젝트에 포함하거나 CDN 사용

**참고:**
- [use-sound Hook](https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/)

---

## 6. 음성 인식 (Speech-to-Text)

### 6.1 Web Speech API

**브라우저 지원 현황:**
| 브라우저 | 지원 여부 |
|----------|-----------|
| Chrome | ✅ 완전 지원 |
| Edge | ✅ 완전 지원 |
| Firefox | ❌ 미지원 |
| Safari (iOS) | ⚠️ 제한적 (workaround 필요) |

**특징:**
- 무료
- Chrome에서는 서버 기반 인식 → 인터넷 필요
- 최신: On-device 인식 옵션 (언어팩 다운로드 후 오프라인 가능)

**한계:**
- 브라우저 호환성 낮음
- 정확도가 브라우저마다 상이
- 오프라인 기능 제한적

### 6.2 OpenAI Whisper API (권장 - 부가기능용)

**가격 (2025년 12월 기준):**
| 모델 | 가격 |
|------|------|
| Whisper | $0.006/분 ($0.36/시간) |
| GPT-4o Transcribe | $0.006/분 |
| GPT-4o Mini Transcribe | $0.003/분 ($0.18/시간) |

**장점:**
- 99개 이상 언어 지원
- 높은 정확도
- 화자 분리(Diarization) 지원
- 신규 계정 $5 무료 크레딧 (약 13.9시간 분량)

**사용 시나리오:**
- 스크럼 미팅 녹음 후 일괄 전사
- 실시간 전사 (스트리밍 지원)

### 6.3 대안 서비스

| 서비스 | 특징 |
|--------|------|
| AssemblyAI | API 중심, 요약/챕터 자동 생성 |
| Deepgram | 실시간 전사 특화 |
| Google Cloud STT | 엔터프라이즈급, 한국어 우수 |

**참고:**
- [OpenAI Whisper API Pricing](https://costgoat.com/pricing/openai-transcription)
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)

---

## 7. AI 요약

### 7.1 OpenAI GPT API

**활용 방법:**
1. Whisper로 음성 → 텍스트 전사
2. GPT-4로 전사본 요약

**예상 프롬프트:**
```
다음은 데일리 스크럼 미팅 내용입니다.
각 팀원별로 다음을 정리해주세요:
1. 어제 한 일
2. 오늘 할 일
3. 블로커/이슈
```

### 7.2 기존 미팅 요약 서비스

| 서비스 | 가격 | 특징 |
|--------|------|------|
| Otter.ai | 무료~$20/월 | 95% 정확도, 자동 요약 |
| Fireflies.ai | 무료~$10/월 | 800분 무료, API 제공 |
| Hyprnote | 무료~$8/월 | 로컬 처리, 프라이버시 |
| Jamie | 다양 | GPT-4/Claude 선택 가능 |

**권장 접근:**
- MVP에서는 제외
- 추후 OpenAI API로 직접 구현 또는 외부 서비스 연동

**참고:**
- [Zapier - Best AI Meeting Assistants](https://zapier.com/blog/best-ai-meeting-assistant/)

---

## 8. 화면 공유 + 펜 드로잉

### 8.1 기술 스택

**화면 공유:**
- `navigator.mediaDevices.getDisplayMedia()` API
- WebRTC로 다른 참가자에게 스트림 전송

**펜 드로잉 (Annotation):**
- HTML5 Canvas API
- 화면 캡처 위에 Canvas 오버레이
- 터치/마우스 이벤트로 드로잉

### 8.2 구현 복잡도: 높음

**필요 요소:**
1. WebRTC 시그널링 서버
2. TURN/STUN 서버 (NAT 통과)
3. Canvas 동기화 로직
4. 실시간 데이터 전송 (DataChannel)

**기존 솔루션:**
| 프로젝트 | 설명 |
|----------|------|
| [WebRTC-Telestrator](https://github.com/BlankSourceCode/WebRTC-Telestrator) | 원격 화면에 드로잉 |
| [Canvas Designer](https://www.webrtc-experiment.com/Canvas-Designer/) | 실시간 협업 화이트보드 |
| [Drawmote](https://github.com/dulnan/drawmote) | 폰 자이로스코프로 원격 드로잉 |

### 8.3 권장 접근

**MVP에서 제외하고 추후 고려:**
- 슬랙 허들로 화면 공유 대체 가능
- 드로잉은 Miro, FigJam 등 기존 도구 연동 고려

**참고:**
- [WebRTC Samples](https://webrtc.github.io/samples/)
- [DEV - Realtime Collaborative Drawing](https://dev.to/nyxtom/realtime-collaborative-drawing-with-canvas-and-webrtc-2d01)

---

## 9. 슬랙 허들 연동

### 9.1 현재 상황

**슬랙 API 제한:**
- 허들(Huddle) 자체를 프로그래밍으로 제어하는 공식 API 없음
- 허들 참가자 정보나 녹음 접근 불가
- 슬랙 허들은 별도로 사용하고, 타이머 앱은 독립적으로 운영

### 9.2 대안 접근

1. **독립 운영:** 허들은 음성용, 타이머 앱은 화면 공유로 참가자들에게 보여줌
2. **슬랙 봇 연동:** 타이머 시작/종료를 슬랙 채널에 메시지로 전송
3. **Webhook:** 스크럼 요약을 슬랙에 자동 포스팅

---

## 10. 기술 스택 최종 권장안

### 10.1 MVP (Phase 1)

| 영역 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router) |
| 언어 | TypeScript |
| UI | shadcn/ui + Tailwind CSS |
| 애니메이션 | Motion (Framer Motion) |
| 오디오 | use-sound + 알림음 파일 |
| 상태관리 | Zustand 또는 React Context |
| 배포 | Vercel |

### 10.2 확장 (Phase 2+)

| 영역 | 기술 |
|------|------|
| 음성 인식 | OpenAI Whisper API |
| AI 요약 | OpenAI GPT-4 API |
| 슬랙 연동 | Slack Web API (봇) |
| DB (팀원 저장) | Vercel KV 또는 localStorage |

### 10.3 미래 고려 (Phase 3)

| 영역 | 기술 |
|------|------|
| 화면 공유 | WebRTC + getDisplayMedia |
| 펜 드로잉 | Canvas API + WebRTC DataChannel |

---

## 11. 리스크 및 고려사항

| 리스크 | 영향 | 대응 |
|--------|------|------|
| Web Speech API 호환성 | 중 | Chrome/Edge 권장, Whisper 대안 |
| shadcn/Radix 유지보수 불확실성 | 낮 | 코드 소유하므로 마이그레이션 가능 |
| 화면공유+드로잉 구현 복잡도 | 높 | MVP 제외, 기존 도구 활용 |
| 오디오 autoplay 정책 | 중 | 사용자 인터랙션 후 사운드 활성화 |

---

## 12. 참고 자료

### 공식 문서
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motion](https://motion.dev/)

### 기술 블로그
- [use-sound React Hook - Josh W. Comeau](https://www.joshwcomeau.com/react/announcing-use-sound-react-hook/)
- [Web Speech API - MDN](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Realtime Collaborative Drawing - DEV](https://dev.to/nyxtom/realtime-collaborative-drawing-with-canvas-and-webrtc-2d01)

### 가격 정보
- [OpenAI Transcription Pricing](https://costgoat.com/pricing/openai-transcription)
- [AI Meeting Assistant Comparison - Zapier](https://zapier.com/blog/best-ai-meeting-assistant/)

---

*다음 단계: PRD 문서 작성*
