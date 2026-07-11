---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../package.json
  - ../../pnpm-lock.yaml
---

# 의존성 업데이트

## 원칙

pnpm만 사용하고 한 작업에서 역할이 연관된 package를 함께 갱신한다. Next.js, React, React DOM, eslint-config-next처럼 호환되는 묶음은 peer dependency를 먼저 확인한다.

## 절차

1. 공식 release와 migration guide를 확인한다.
2. `pnpm view <package> version engines peerDependencies`로 지원 범위를 확인한다.
3. package를 갱신하고 `pnpm install`로 lockfile을 만든다.
4. `pnpm install --frozen-lockfile`로 재현성을 확인한다.
5. `pnpm check`와 `pnpm test:e2e`를 실행한다.
6. adoption matrix와 관련 stack 문서를 갱신한다.

새 기능은 migration과 분리한다. 버전 교체만으로 Pro mode, React Compiler, remote cache, 새로운 상태 library를 활성화하지 않는다.
