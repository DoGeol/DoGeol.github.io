import { expect, test } from '@playwright/test'

const routes = [
  { path: '/', text: '메인페이지 계획중' },
  { path: '/blog', text: '블로그 페이지' },
  { path: '/resume', text: 'Experience' },
  { path: '/old-resume', text: '편도걸' },
  { path: '/components', text: 'Components' },
  { path: '/components/accordion', text: 'Accordion' },
  { path: '/components/input', text: 'Input' },
  { path: '/missing-page', text: 'Page Not Found' },
] as const

for (const route of routes) {
  test(`${route.path} route를 렌더링한다`, async ({ page }) => {
    await page.goto(route.path)

    if (route.path.startsWith('/components/')) {
      await expect(page.getByRole('heading', { name: route.text, level: 1 })).toBeVisible()
    } else {
      await expect(page.getByText(route.text, { exact: false }).first()).toBeVisible()
    }
  })
}

test('/resume 현행 디자인을 유지한다 @visual', async ({ page }) => {
  await page.goto('/resume')
  await page.evaluate(() => document.fonts.ready)

  await expect(page).toHaveScreenshot('resume.png', {
    fullPage: true,
  })
})

test('컴포넌트 문서를 탐색한다', async ({ page }) => {
  await page.goto('/components/accordion')
  if ((page.viewportSize()?.width ?? 1280) < 768) {
    await page.getByRole('button', { name: '메뉴 열기' }).click()
    await page.getByRole('dialog').getByRole('link', { name: 'Input', exact: true }).click()
  } else {
    await page.getByRole('link', { name: 'Input', exact: true }).first().click()
  }
  await expect(page).toHaveURL(/\/components\/input$/)
  await expect(page.getByRole('heading', { name: 'Input', level: 1 })).toBeVisible()
})

test('모바일 컴포넌트 메뉴를 연다', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/components/accordion')
  await page.getByRole('button', { name: '메뉴 열기' }).click()
  await expect(page.getByRole('dialog', { name: '컴포넌트 메뉴' })).toBeVisible()
})

test('/components/accordion 현행 디자인을 유지한다 @visual', async ({ page }) => {
  await page.goto('/components/accordion')
  await page.evaluate(() => document.fonts.ready)
  await expect(page).toHaveScreenshot('component-accordion.png', { fullPage: true })
})
