import { readFile } from 'node:fs/promises'

import { expect, test } from '@playwright/test'

const canonicalEditorUrl = '/blog-editor/edit?postId=018f6f4d-9751-7df0-a5fb-8f13f57a2100'

test.beforeEach(async ({ page }, testInfo) => {
  if (testInfo.title.includes('@public')) {
    await page.goto('/blog')
    await page.evaluate(() => window.sessionStorage.clear())
    return
  }

  await page.goto('/blog-editor')
  await page.evaluate(() => window.sessionStorage.clear())
})

test('공개 목록을 검색하고 상세 글을 읽는다 @public', async ({ page }, testInfo) => {
  await expect(page.getByRole('heading', { name: '기술과 일에 관한 기록' })).toBeVisible()
  await page.getByRole('searchbox').fill('Architecture')
  await page.getByRole('link', { name: /React Server Components를 이해하는 방법/ }).click()

  await expect(
    page.getByRole('heading', { level: 1, name: 'React Server Components를 이해하는 방법' }),
  ).toBeVisible()
  const tableOfContents = page.getByRole('complementary', { name: '이 글의 목차' })
  if (testInfo.project.name.startsWith('desktop')) {
    await expect(tableOfContents).toBeVisible()
  } else {
    await expect(tableOfContents).toBeHidden()
  }
  await expect(page.getByRole('button', { name: '복사' })).toBeVisible()
})

test('desktop 편집기는 40:60 편집·프리뷰를 동시에 제공한다', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop'), 'desktop 전용')
  await page.goto(canonicalEditorUrl)

  const editorPane = page.getByRole('tabpanel', { name: '편집' })
  const previewPane = page.getByRole('tabpanel', { name: '프리뷰' })
  await expect(editorPane).toBeVisible()
  await expect(previewPane).toBeVisible()
  await expect(editorPane.locator('.bn-editor')).toBeVisible()
  await expect(previewPane.locator('.bn-editor')).toBeVisible()
  const [editorBox, previewBox] = await Promise.all([
    editorPane.boundingBox(),
    previewPane.boundingBox(),
  ])
  expect(
    (editorBox?.width ?? 0) / ((editorBox?.width ?? 0) + (previewBox?.width ?? 0)),
  ).toBeCloseTo(0.4, 1)
})

test('metadata 수정과 session 복구, JSON 내보내기가 동작한다', async ({ page }) => {
  await page.goto(canonicalEditorUrl)
  const title = page.getByLabel('제목')
  await title.fill('수정한 RSC 글')
  await expect(page.getByRole('heading', { name: '수정한 RSC 글' }).last()).toBeVisible()
  await expect(page.getByText(/현재 탭에 저장됨/)).toBeVisible()
  await page.reload()
  await expect(page.getByLabel('제목')).toHaveValue('수정한 RSC 글')

  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'JSON 내보내기' }).click()
  const download = await downloadPromise
  expect(download.suggestedFilename()).toBe('react-server-components.json')
  expect(JSON.parse(await readFile(await download.path(), 'utf8')).title).toBe('수정한 RSC 글')
})

test('mobile 편집기는 keyboard tab으로 pane을 전환한다', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'mobile 전용')
  await page.goto(canonicalEditorUrl)
  const editTab = page.getByRole('tab', { name: '편집' })
  const previewTab = page.getByRole('tab', { name: '프리뷰' })
  await expect(page.getByRole('tabpanel', { name: '편집' })).toBeVisible()
  await editTab.focus()
  await page.keyboard.press('ArrowRight')
  await expect(previewTab).toBeFocused()
  await expect(page.getByRole('tabpanel', { name: '프리뷰' })).toBeVisible()
  await expect(page.getByRole('tabpanel', { name: '편집' })).toBeHidden()
})

test('공개 상세 디자인을 유지한다 @visual @public', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop'), 'desktop 시각 기준선')
  await page.goto('/blog/react-server-components')
  await expect(page.getByRole('button', { name: '복사' })).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await expect(page).toHaveScreenshot('blog-article-desktop.png', { fullPage: true })
})

test('편집기 desktop 디자인을 유지한다 @visual', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop'), 'desktop 시각 기준선')
  await page.goto(canonicalEditorUrl)
  await expect(page.locator('.bn-editor').first()).toBeVisible()
  await page.evaluate(() => document.fonts.ready)
  await expect(page).toHaveScreenshot('blog-editor-desktop.png')
})
