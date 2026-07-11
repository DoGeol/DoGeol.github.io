import { expect, test } from '@playwright/test'

const routes = [
  { path: '/', text: '메인페이지 계획중' },
  { path: '/blog', text: '블로그 페이지' },
  { path: '/resume', text: 'Experience' },
  { path: '/old-resume', text: '편도걸' },
  { path: '/missing-page', text: 'Page Not Found' },
] as const

for (const route of routes) {
  test(`${route.path} route를 렌더링한다`, async ({ page }) => {
    await page.goto(route.path)

    await expect(page.getByText(route.text, { exact: false }).first()).toBeVisible()
  })
}

test('/resume 현행 디자인을 유지한다', async ({ page }) => {
  await page.goto('/resume')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('resume.png', {
    fullPage: true,
  })
})
