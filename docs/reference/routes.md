---
status: active
lastReviewed: 2026-07-13
sourceOfTruth:
  - ../../src/app
---

# 라우트 참조

| URL | 소스 | 역할 | 정적 export |
| --- | --- | --- | --- |
| `/` | `src/app/(pages)/(main)/page.tsx` | 메인 placeholder | `out/index.html` |
| `/blog` | `src/app/(pages)/blog/page.tsx` | 공개 글 목록·검색·태그 | `out/blog.html` |
| `/blog/[slug]` | `src/app/(pages)/blog/[slug]/page.tsx` | 정적 기술 글 상세 | `out/blog/<slug>.html` |
| `/blog/rss.xml` | `src/app/(pages)/blog/rss.xml/route.ts` | 공개 글 RSS | `out/blog/rss.xml` |
| `/sitemap.xml` | `src/app/sitemap.ts` | 공개 route sitemap | `out/sitemap.xml` |
| `/resume` | `src/app/(pages)/resume/page.tsx` | 현재 이력서 | `out/resume.html` |
| `/old-resume` | `src/app/(pages)/old-resume/page.tsx` | 이전 이력서 | `out/old-resume.html` |
| `/components` | `src/app/(pages)/components/page.tsx` | UI 카탈로그 | `out/components.html` |
| `/components/accordion` | `src/app/(pages)/components/[slug]/page.tsx` | Accordion 문서 | `out/components/accordion.html` |
| `/components/input` | `src/app/(pages)/components/[slug]/page.tsx` | Input 문서 | `out/components/input.html` |
| 기타 | `src/app/not-found.tsx` | 404 안내 | `out/404.html` |

development server에서만 `/resume-editor`, `/resume-preview`, `/blog-editor`, `/blog-editor/edit?postId=…`를 제공한다. `.dev.tsx` entry라 production compile과 `out/`에 포함되지 않는다.

루트 layout이 공통 metadata와 viewport를 제공한다. `/resume`, `/blog`와 글 상세는 개별 metadata를 추가한다. 라우트를 추가·삭제하거나 URL이 바뀌면 이 표, sitemap, RSS, Playwright route test를 함께 갱신한다.
