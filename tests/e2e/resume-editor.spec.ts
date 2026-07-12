import { expect, test } from '@playwright/test'

test('form과 실제 preview를 양방향으로 연결한다', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('desktop'), 'desktop 연결 gate')
  await page.goto('/resume-editor')
  const preview = page.frameLocator('iframe[title="실제 이력서 프리뷰"]')
  await expect(preview.getByText('Experience')).toBeVisible()

  await page.getByRole('button', { name: '경력', exact: true }).click()
  const companyName = page.getByLabel('회사명').first()
  await companyName.fill('프리뷰 테스트 회사')
  await expect(preview.getByText('프리뷰 테스트 회사')).toBeVisible()

  await page.getByLabel('이력서 제목').focus()
  const selectionMessage = page.evaluate(
    () =>
      new Promise<unknown>((resolve) => {
        const receive = (event: MessageEvent) => {
          if (event.data?.type !== 'SELECT_REGION') return
          window.removeEventListener('message', receive)
          resolve(event.data)
        }
        window.addEventListener('message', receive)
      }),
  )
  await preview
    .locator('[data-preview-region-id="experience-1"]')
    .click({ position: { x: 20, y: 20 } })
  expect(await selectionMessage).toMatchObject({ type: 'SELECT_REGION', regionId: 'experience-1' })
  await expect(page.locator('[data-editor-region-id="experience-1"]')).toHaveClass(/ring-2/)
  await expect(companyName).toBeFocused()
})

test('mobile preview 선택은 editor pane을 열고 field에 focus한다', async ({ page }, testInfo) => {
  test.skip(!testInfo.project.name.startsWith('mobile'), 'mobile 연결 gate')
  await page.goto('/resume-editor')
  await page.getByRole('tab', { name: '프리뷰' }).click()
  await expect(page.getByRole('tabpanel', { name: '프리뷰' })).toBeVisible()

  const preview = page.frameLocator('iframe[title="실제 이력서 프리뷰"]')
  await expect(preview.getByText('Experience')).toBeVisible()
  await preview
    .locator('[data-preview-region-id="experience-1"]')
    .click({ position: { x: 20, y: 20 } })

  await expect(page.getByRole('tab', { name: '편집' })).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: '편집' })).toBeVisible()
  await expect(page.getByLabel('회사명').first()).toBeFocused()
})
