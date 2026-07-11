# GitHub Actions 품질 검사와 Pages 자동 배포 설계

## 목표

PR과 `develop`에서 품질 검사를 자동화하고, 검증된 `main` 커밋만 `https://dogeol.github.io/`에 배포한다. 기존 `gh-pages` 브랜치 게시 방식은 GitHub 공식 Pages artifact 배포 방식으로 전환한다.

## 확인된 현재 상태

- 저장소는 공개이며 기본 브랜치는 `main`이다.
- Pages는 `gh-pages` 브랜치 루트를 사용하는 `legacy` 방식이다.
- GitHub Actions workflow는 없다.
- Node 22.13 이상, pnpm 10.28.2, Next.js 정적 export를 사용한다.
- 로컬 `pnpm docs:check`, `pnpm check`, `pnpm test:e2e`가 완료 기준이다.

## 비용 경계

공개 저장소의 표준 GitHub-hosted runner와 GitHub Pages 사용은 무료다. `ubuntu-latest`만 사용하고 larger runner, macOS runner, 별도 장기 artifact는 사용하지 않는다. Pages 배포 artifact만 생성한다.

## 선택한 접근

단일 `.github/workflows/quality-and-deploy.yml`에서 품질 검사와 조건부 배포를 연결한다. 분리 workflow보다 설치와 build 중복이 적고, `deploy` job이 `quality` 성공에 직접 의존해 배포 전 검증을 우회할 수 없다.

기존 `gh-pages` package를 호출하는 방식은 legacy 게시 소스와 배포용 dependency를 유지해야 하므로 제거한다. GitHub 공식 `configure-pages`, `upload-pages-artifact`, `deploy-pages` Actions를 사용한다.

## 트리거와 권한

| 이벤트            | 대상              | 결과                     |
| ----------------- | ----------------- | ------------------------ |
| pull request      | `main`, `develop` | 품질 검사                |
| push              | `develop`         | 품질 검사                |
| push              | `main`            | 품질 검사 후 배포        |
| workflow dispatch | `main`            | 품질 검사 후 수동 재배포 |

workflow 기본 권한은 `contents: read`다. 배포 job에만 `pages: write`, `id-token: write`를 부여하고 `github-pages` environment를 사용한다. 품질 검사는 같은 ref의 이전 실행을 취소한다. main 배포는 실행 중인 배포를 취소하지 않고 하나만 허용한다.

## 품질 job

`ubuntu-latest`에서 checkout, pnpm, Node를 설정하고 pnpm store cache를 사용한다. `pnpm install --frozen-lockfile`, `pnpm docs:check`, `pnpm check`를 실행한다. Chromium과 OS dependency를 설치한 뒤 `pnpm test:e2e:ci`로 route smoke test를 실행한다.

현재 screenshot 기준선은 macOS 렌더링 결과이므로 Linux CI에서 픽셀 비교하지 않는다. `/resume` desktop/mobile screenshot은 로컬 `pnpm test:e2e`가 계속 검증한다. 시각 테스트 제목에 `@visual` tag를 붙이고 CI script는 해당 tag만 제외한다.

main 배포 실행에서는 `pnpm check`가 생성한 `out/`을 Pages artifact로 업로드한다. `index`, `blog`, `resume`, `old-resume`, `404` HTML 존재 여부를 업로드 전에 확인한다.

## 배포 job

`deploy`는 `quality` job 성공과 main의 push 또는 workflow dispatch를 조건으로 실행한다. `actions/deploy-pages`가 Pages artifact를 배포하고 결과 URL을 environment URL로 노출한다. 최초 적용 시 Pages 설정의 `build_type`을 `workflow`로 변경한다.

## Action 버전과 업데이트

작성 시점 안정 버전은 checkout 7.0.0, pnpm/action-setup 6.0.9, setup-node 6.4.0, configure-pages 6.0.0, upload-pages-artifact 5.0.0, deploy-pages 5.0.0이다. workflow에서는 공급망 변조를 줄이기 위해 release commit SHA로 고정하고 버전을 주석으로 남긴다.

`.github/dependabot.yml`은 `github-actions` ecosystem을 주 1회 확인하고 같은 공급자 업데이트를 한 PR로 묶는다.

## 저장소 변경

- `package.json`: `test:e2e:ci` 추가, legacy `deploy`와 `predeploy` 제거
- `pnpm-lock.yaml`: `gh-pages` 제거 반영
- `tests/e2e/routes.spec.ts`: screenshot test에 `@visual` tag 추가
- `.github/workflows/quality-and-deploy.yml`: 품질 검사와 Pages 배포
- `.github/dependabot.yml`: Action 버전 갱신
- `docs/how-to/development.md`: 로컬·CI E2E 경계
- `docs/how-to/github-pages-deployment.md`: Actions 자동 배포와 수동 재실행
- `docs/reference/doc-map.md`: workflow 변경 시 확인 문서 유지

## 실패 처리

품질 명령 하나라도 실패하면 artifact 업로드와 배포가 실행되지 않는다. 배포 job 실패는 기존 Pages 결과를 대체하지 않으며 Actions log에서 재실행한다. Pages source 전환은 workflow가 원격에 존재한 뒤 수행한다.

## 검증과 완료 조건

- workflow YAML을 actionlint로 검사한다.
- 로컬 frozen install, 문서 검사, 전체 check, 전체 E2E가 성공한다.
- `test:e2e:ci`가 screenshot을 제외한 10개 desktop/mobile route test를 성공한다.
- feature branch에서 `develop` 대상 PR을 열어 Actions 품질 job 성공을 확인한다.
- main 반영 후 Pages workflow 성공과 `https://dogeol.github.io/` 응답을 확인한다.
- GitHub Pages API가 `build_type: workflow`를 반환한다.

## 참고

- [GitHub Pages custom workflow](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
- [GitHub Actions billing](https://docs.github.com/en/billing/concepts/product-billing/github-actions)
