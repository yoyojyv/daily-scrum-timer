# Oracle Cloud Ubuntu에서 Next.js 앱 배포 가이드

## TL;DR

- Node.js 20 이상 필요 (Ubuntu 기본 저장소는 버전이 낮음)
- iptables 규칙 순서가 중요 (REJECT 앞에 포트 허용 규칙 추가)
- Oracle Cloud 콘솔 보안 목록에서 포트 열어야 함
- 보안 목록의 "소스 포트 범위"는 비워두기 (All)

---

## 1. Node.js 업그레이드

Ubuntu 기본 저장소의 Node.js는 버전이 낮아 Next.js 요구사항을 충족하지 못함.

### 방법 1: NodeSource 저장소 (권장)

```bash
# 기존 Node.js 제거
sudo apt remove nodejs npm

# NodeSource 저장소 추가 (Node.js 22.x)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Node.js 설치
sudo apt install -y nodejs

# 확인
node -v
```

### 방법 2: nvm 사용

```bash
# nvm 설치
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash

# 셸 재로드
source ~/.bashrc

# 특정 버전 설치
nvm install 22.17.0
nvm alias default 22.17.0

# 확인
node -v
```

---

## 2. Next.js 앱 실행

```bash
# 빌드
npm run build

# 프로덕션 모드 실행
npm run start
```

---

## 3. PM2로 프로세스 관리

PM2는 Node.js 앱을 백그라운드에서 실행하고, 크래시 시 자동 재시작, 서버 부팅 시 자동 실행 등을 지원하는 프로세스 매니저.

### 3.1 PM2 설치

```bash
sudo npm install -g pm2
```

### 3.2 Next.js 앱 시작

```bash
# 기본 실행
pm2 start npm --name "next-app" -- start

# 포트 지정
pm2 start npm --name "next-app" -- start -- -p 3000

# 또는 직접 next 명령어 사용
pm2 start node_modules/.bin/next --name "next-app" -- start
```

### 3.3 ecosystem 설정 파일 (권장)

프로젝트 루트에 `ecosystem.config.js` 파일 생성:

```javascript
module.exports = {
  apps: [
    {
      name: 'next-app',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/home/ubuntu/your-app-directory',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
```

설정 파일로 실행:

```bash
pm2 start ecosystem.config.js
```

### 3.4 서버 재부팅 시 자동 실행 설정

```bash
# 현재 실행 중인 프로세스 목록 저장
pm2 save

# 시스템 시작 스크립트 생성
pm2 startup

# 출력되는 명령어를 복사해서 실행
# 예: sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ubuntu --hp /home/ubuntu
```

### 3.5 기본 명령어

| 명령어 | 설명 |
|--------|------|
| `pm2 list` | 실행 중인 프로세스 목록 |
| `pm2 status` | 프로세스 상태 확인 |
| `pm2 logs` | 전체 로그 보기 |
| `pm2 logs next-app` | 특정 앱 로그 보기 |
| `pm2 logs --lines 100` | 최근 100줄 로그 |
| `pm2 monit` | 실시간 모니터링 대시보드 |

### 3.6 프로세스 제어

| 명령어 | 설명 |
|--------|------|
| `pm2 stop next-app` | 앱 중지 |
| `pm2 start next-app` | 앱 시작 |
| `pm2 restart next-app` | 앱 재시작 |
| `pm2 reload next-app` | 무중단 재시작 (클러스터 모드) |
| `pm2 delete next-app` | 앱 삭제 (목록에서 제거) |

### 3.7 전체 관리

| 명령어 | 설명 |
|--------|------|
| `pm2 stop all` | 모든 앱 중지 |
| `pm2 restart all` | 모든 앱 재시작 |
| `pm2 delete all` | 모든 앱 삭제 |
| `pm2 kill` | PM2 데몬 종료 |
| `pm2 update` | PM2 업데이트 후 프로세스 복구 |

### 3.8 로그 관리

```bash
# 로그 실시간 확인
pm2 logs

# 로그 비우기
pm2 flush

# 로그 로테이션 설치 (권장)
pm2 install pm2-logrotate

# 로테이션 설정
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3.9 유용한 정보 확인

```bash
# 앱 상세 정보
pm2 show next-app

# 환경 변수 확인
pm2 env next-app

# 메모리/CPU 사용량
pm2 monit
```

### 3.10 배포 후 재시작 워크플로우

```bash
# 코드 업데이트 후
cd /home/ubuntu/your-app-directory
git pull
npm install
npm run build
pm2 restart next-app
```

---

## 4. 서버 방화벽 (iptables) 설정

Oracle Cloud Ubuntu는 기본적으로 iptables 규칙이 설정되어 있음.

### 현재 규칙 확인

```bash
sudo iptables -L INPUT -n --line-numbers
```

### 포트 허용 규칙 추가

**중요**: REJECT 규칙 **앞에** 추가해야 함!

```bash
# REJECT 규칙 번호 확인 후, 그 번호에 삽입
# 예: REJECT가 5번이면 5번 위치에 삽입
sudo iptables -I INPUT 5 -m state --state NEW -p tcp --dport 3000 -j ACCEPT

# 규칙 저장 (재부팅 후에도 유지)
sudo netfilter-persistent save
```

### 올바른 규칙 순서 예시

```
num  target     prot opt source               destination
1    ACCEPT     ...  state RELATED,ESTABLISHED
2    ACCEPT     ...  (icmp)
3    ACCEPT     ...  (loopback)
4    ACCEPT     tcp  ...  dpt:22
5    ACCEPT     tcp  ...  dpt:3000   ← REJECT 앞!
6    REJECT     ...  icmp-host-prohibited
```

### 잘못된 규칙 수정

만약 포트 규칙이 REJECT 뒤에 있다면:

```bash
# 잘못된 위치의 규칙 삭제 (번호 확인 후)
sudo iptables -D INPUT 6

# 올바른 위치에 다시 추가
sudo iptables -I INPUT 5 -m state --state NEW -p tcp --dport 3000 -j ACCEPT

# 저장
sudo netfilter-persistent save
```

---

## 5. Oracle Cloud 콘솔 보안 목록 설정

iptables만 열어서는 안 됨. **Oracle Cloud 콘솔에서도 포트를 열어야 함**.

### 설정 경로

1. Oracle Cloud 콘솔 로그인
2. **네트워킹** → **가상 클라우드 네트워크 (VCN)**
3. 해당 VCN 클릭 → **서브넷** 선택
4. **보안 목록** 클릭
5. **수신 규칙 추가**

### 수신 규칙 설정값

| 항목 | 값 |
|------|-----|
| Stateless | 아니오 |
| 소스 유형 | CIDR |
| 소스 CIDR | `0.0.0.0/0` |
| IP 프로토콜 | TCP |
| 소스 포트 범위 | **비워두기 (All)** |
| 대상 포트 범위 | `3000` |

**주의**: 소스 포트 범위에 값을 넣으면 접속이 안 됨!

---

## 6. 확인 및 테스트

### 서버에서 확인

```bash
# 포트 리스닝 확인
sudo ss -tlnp | grep 3000

# iptables 규칙 확인
sudo iptables -L INPUT -n | grep 3000
```

### 외부에서 테스트

```bash
curl -I http://<서버-PUBLIC-IP>:3000
```

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| 로컬은 되는데 외부 안됨 | iptables 또는 보안 목록 | 두 군데 모두 확인 |
| iptables 열었는데 안됨 | 규칙 순서 문제 | REJECT 앞에 규칙 추가 |
| 보안 목록 열었는데 안됨 | 소스 포트 범위 설정 | 소스 포트는 비워두기 |
| 127.0.0.1만 리스닝 | Next.js 바인딩 문제 | `next start -H 0.0.0.0` |
