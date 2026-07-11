---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../package.json
  - ../src
---

# 프로젝트 Wiki

이 디렉터리는 코드와 같은 Git 이력으로 관리하는 프로젝트 지식의 기준이다. 작업 계획과 진행 기록은 완료 후 여기의 설명·참조·실행 가이드로 정제한다.

## 프로젝트 이해

- [아키텍처](explanation/architecture.md)
- [프로젝트 구조](explanation/project-structure.md)
- [라우트 참조](reference/routes.md)
- [변경 경로와 문서 연결](reference/doc-map.md)

## 기술 스택

- [기술 스택 홈](reference/stack/README.md)
- [도입 상태](reference/adoption-matrix.md)
- [React 스택 마이그레이션](migrations/react-stack-2026.md)

## 작업 가이드

- [개발](how-to/development.md)
- [GitHub Pages 배포](how-to/github-pages-deployment.md)
- [의존성 업데이트](how-to/dependency-upgrade.md)

## 문서 원칙

- 한 문서는 하나의 질문·개념·작업을 다룬다.
- 일반 Wiki는 250줄·12KB·H2 7개를 soft limit으로 삼는다.
- 설치 버전은 `package.json`과 `pnpm-lock.yaml`을 기준으로 한다.
- 코드 구조·명령·동작이 바뀌면 같은 작업에서 관련 Wiki를 갱신한다.
