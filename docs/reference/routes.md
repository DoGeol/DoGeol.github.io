---
status: active
lastReviewed: 2026-07-11
sourceOfTruth:
  - ../../src/app
---

# 라우트 참조

| URL | 소스 | 역할 | 정적 export |
| --- | --- | --- | --- |
| `/` | `src/app/(pages)/(main)/page.tsx` | 메인 placeholder | `out/index.html` |
| `/blog` | `src/app/(pages)/blog/page.tsx` | 블로그 placeholder | `out/blog.html` |
| `/resume` | `src/app/(pages)/resume/page.tsx` | 현재 이력서 | `out/resume.html` |
| `/old-resume` | `src/app/(pages)/old-resume/page.tsx` | 이전 이력서 | `out/old-resume.html` |
| 기타 | `src/app/not-found.tsx` | 404 안내 | `out/404.html` |

루트 layout이 공통 metadata와 viewport를 제공한다. `/resume`과 `/blog`는 개별 metadata를 추가한다. 라우트를 추가·삭제하거나 URL이 바뀌면 이 표, sitemap, Playwright route test를 함께 갱신한다.
