# [2026-08-10 1차 갱신] ⚾ OOTP Stat Converter (리그간 세이버메트릭스 스탯 변환기)

> 해외 야구 리그(KBO, NPB, AAA)의 타자/투수 성적을 세이버메트릭스 MLE(Major League Equivalency) 보정 계수를 적용하여 MLB 기준 성적으로 환산해 주는 풀스택 웹 애플리케이션입니다.

---

## 🛠️ 기술 스택 (Tech Stack)

### 🔹 Backend
- **Java 17**
- **Spring Boot 3.2.x / 3.3.x**
- **Spring Web (REST API)**
- **Lombok**
- **Gradle**

### 🔹 Frontend
- **React 19**
- **TypeScript**
- **Vite 6**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Axios**
- **pnpm / npm**

---

## 📁 프로젝트 구조 (Project Structure)

```text
KBOtoMLB/
├── docs/                        # 레퍼런스 코드 문서 폴더
│   ├── backend_code.md          # Spring Boot 백엔드 레퍼런스
│   ├── frontend_code_v1_js.md   # [구버전] JS + Tailwind v3 레퍼런스
│   └── frontend_code_v2_ts.md   # [최신] TS + Tailwind v4 레퍼런스
├── backend/                     # Spring Boot 백엔드 애플리케이션
│   ├── build.gradle
│   └── src/main/java/com/ootp/converter/
│       ├── controller/StatConversionController.java
│       ├── dto/BatterStatDto.java, PitcherStatDto.java
│       └── service/StatConversionService.java
└── frontend/                    # React + TypeScript 프론트엔드 애플리케이션
    ├── package.json
    ├── vite.config.ts
    └── src/
        ├── App.tsx
        ├── index.css
        └── types/stat.ts
```

---

## 📐 환산 로직 (Conversion Logic)

### 1. 타자 (Batter)
- **KBO ➡️ MLB**: 타율(BA) -0.040 깎고, 2B(비율 보정), 3B x 0.5, HR x 0.5, BB x 0.85, SO x 1.25, SB x 0.8
- **NPB ➡️ MLB**: 타율(BA) -0.050 깎고, 2B(비율 보정), HR x 0.7, BB x 0.85, SO x 1.20, SB x 0.85 (3B 유지)
- **AAA ➡️ MLB**: 타율(BA) -0.044 깎고, 2B(비율 보정), 3B x 0.6, HR x 0.65, BB x 0.85, SO x 1.20

### 2. 투수 (Pitcher)
- **KBO ➡️ MLB**: HR x 1.5, BB x 1.15, SO x 0.9, H x 1.2 (IP, HBP 유지)
- **NPB ➡️ MLB**: HR x 1.35, BB x 1.10, SO x 0.9, H x 1.1 (IP, HBP 유지)
- **AAA ➡️ MLB**: HR x 1.40, BB x 1.12, SO x 0.92, H x 1.15

*(※ 최종 결과 스탯 중 이닝(IP)을 제외한 모든 결과값은 정수 반올림 적용)*

---

## 🚀 실행 방법 (Getting Started)

### 1. Backend 실행
```bash
cd backend
./gradlew bootRun
```
백엔드 API 서버: `http://localhost:8080`

### 2. Frontend 실행
```bash
cd frontend
pnpm install
pnpm dev
```
프론트엔드 개발 서버: `http://localhost:5173`

---

## 📝 License
This project is for OOTP baseball game players and sabermetrics analytics enthusiasts.
