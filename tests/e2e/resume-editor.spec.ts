import { readFile } from 'node:fs/promises'

import { expect, test, type Page } from '@playwright/test'

const editorUrl = '/resume-editor'

test.beforeEach(async ({ page }) => {
  await page.goto('/resume')
  await page.evaluate(() => window.sessionStorage.clear())
})

const skipUnless = (projectName: string, target: 'desktop' | 'mobile') => {
  test.skip(!projectName.startsWith(target), `${target} 전용 gate`)
}

const waitForEditor = async (page: Page) => {
  await page.goto(editorUrl)
  await page.evaluate(() => document.fonts.ready)
  await expect(page.getByTestId('preview-status')).toHaveText('연결됨')
}

const openSection = async (page: Page, name: string) => {
  const button = page.getByRole('button', { name, exact: true })
  if ((await button.getAttribute('aria-expanded')) !== 'true') await button.click()
}

const downloadResume = async (page: Page) => {
  const downloadPromise = page.waitForEvent('download')
  await page.getByRole('button', { name: 'JSON 내보내기' }).click()
  const download = await downloadPromise
  return {
    filename: download.suggestedFilename(),
    text: await readFile(await download.path(), 'utf8'),
  }
}

test('desktop shell은 toolbar 아래 40/60 독립 pane을 동시에 표시한다', async ({
  page,
}, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)

  const toolbar = page.getByTestId('editor-toolbar')
  const content = page.getByTestId('editor-content')
  const editorPane = page.getByRole('tabpanel', { name: '편집' })
  const previewPane = page.getByRole('tabpanel', { name: '프리뷰' })
  await expect(editorPane).toBeVisible()
  await expect(previewPane).toBeVisible()
  await expect(toolbar).toHaveCSS('position', 'sticky')
  await expect(toolbar).toHaveCSS('top', '0px')
  await expect(editorPane).toHaveCSS('overflow-y', 'auto')
  await expect(previewPane).toHaveCSS('overflow-y', 'auto')

  const [contentBox, editorBox, previewBox] = await Promise.all([
    content.boundingBox(),
    editorPane.boundingBox(),
    previewPane.boundingBox(),
  ])
  expect(contentBox).not.toBeNull()
  expect(editorBox).not.toBeNull()
  expect(previewBox).not.toBeNull()
  expect((editorBox?.width ?? 0) / (contentBox?.width ?? 1)).toBeCloseTo(0.4, 1)
  expect((previewBox?.width ?? 0) / (contentBox?.width ?? 1)).toBeCloseTo(0.6, 1)
})

test('mobile shell은 tab으로 active pane만 표시하고 가로 overflow가 없다', async ({
  page,
}, testInfo) => {
  skipUnless(testInfo.project.name, 'mobile')
  await waitForEditor(page)

  const editTab = page.getByRole('tab', { name: '편집' })
  const previewTab = page.getByRole('tab', { name: '프리뷰' })
  await expect(editTab).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByRole('tabpanel', { name: '편집' })).toBeVisible()
  await expect(page.getByRole('tabpanel', { name: '프리뷰' })).toBeHidden()

  await editTab.focus()
  await page.keyboard.press('ArrowRight')
  await expect(previewTab).toHaveAttribute('aria-selected', 'true')
  await expect(previewTab).toBeFocused()
  await expect(page.getByRole('tabpanel', { name: '편집' })).toBeHidden()
  await expect(page.getByRole('tabpanel', { name: '프리뷰' })).toBeVisible()
  await page.keyboard.press('ArrowLeft')
  await expect(editTab).toHaveAttribute('aria-selected', 'true')
  await expect(editTab).toBeFocused()
  await page.keyboard.press('End')
  await expect(previewTab).toHaveAttribute('aria-selected', 'true')
  await expect(previewTab).toBeFocused()
  await page.keyboard.press('Home')
  await expect(editTab).toHaveAttribute('aria-selected', 'true')
  await expect(editTab).toBeFocused()
  await page.keyboard.press('ArrowRight')

  for (const [name, width] of [
    ['모바일 390×844', '390'],
    ['태블릿 768×1024', '768'],
    ['데스크톱 1440×1000', '1440'],
  ] as const) {
    const preset = page.getByRole('radio', { name })
    await preset.focus()
    await page.keyboard.press('Space')
    await expect(page.locator('iframe[title="실제 이력서 프리뷰"]')).toHaveAttribute('width', width)
  }

  expect(
    await page.evaluate(() => ({
      document: document.documentElement.scrollWidth <= document.documentElement.clientWidth,
      body: document.body.scrollWidth <= document.body.clientWidth,
    })),
  ).toEqual({ document: true, body: true })
  await expect(page.getByRole('button', { name: '초안 초기화' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'JSON 내보내기' })).toBeVisible()
  const resetButton = page.getByRole('button', { name: '초안 초기화' })
  await resetButton.focus()
  let resetDialogMessage = ''
  page.once('dialog', async (dialog) => {
    resetDialogMessage = dialog.message()
    await dialog.dismiss()
  })
  await page.keyboard.press('Enter')
  expect(resetDialogMessage).toContain('저장된 초안을 지우고 원본으로 되돌릴까요?')
  const exportButton = page.getByRole('button', { name: 'JSON 내보내기' })
  await exportButton.focus()
  const downloadPromise = page.waitForEvent('download')
  await page.keyboard.press('Enter')
  expect((await downloadPromise).suggestedFilename()).toBe('resume.json')
})

test('metadata와 company 수정이 preview에 반영되고 region click이 form으로 돌아온다', async ({
  page,
}, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  const preview = page.frameLocator('iframe[title="실제 이력서 프리뷰"]')

  await page.getByLabel('이력서 제목').fill('프리뷰 테스트 제목')
  await expect
    .poll(async () => {
      const frame = page.frames().find((candidate) => candidate.url().endsWith('/resume-preview'))
      return frame?.title()
    })
    .toBe('프리뷰 테스트 제목')
  await openSection(page, '경력')
  const companyName = page.getByLabel('회사명').first()
  await companyName.fill('프리뷰 테스트 회사')
  await expect(preview.getByText('프리뷰 테스트 회사')).toBeVisible()
  await preview
    .locator('[data-preview-region-id="experience-1"]')
    .click({ position: { x: 20, y: 20 } })
  await expect(page.locator('[data-editor-region-id="experience-1"]')).toHaveClass(/ring-2/)
  await expect(companyName).toBeFocused()
})

test('section 표시 switch가 preview section을 숨기고 다시 표시한다', async ({ page }, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  const preview = page.frameLocator('iframe[title="실제 이력서 프리뷰"]')
  const switchControl = page.getByRole('switch', { name: '활동 표시' })
  await expect(preview.getByText('Activity', { exact: true })).toBeVisible()
  await switchControl.uncheck()
  await expect(preview.getByText('Activity', { exact: true })).toBeHidden()
  await switchControl.check()
  await expect(preview.getByText('Activity', { exact: true })).toBeVisible()
})

test('keyboard DnD 결과가 preview와 exported 배열 순서에 일치한다', async ({ page }, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  const preview = page.frameLocator('iframe[title="실제 이력서 프리뷰"]')

  const informationHandle = page.getByRole('button', { name: '기본 정보 순서 변경' })
  await informationHandle.focus()
  await page.keyboard.press('Space')
  await expect(informationHandle).toHaveAttribute('aria-pressed', 'true')
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  await page.keyboard.press('ArrowDown')
  await expect(
    page.getByText('2번째 위치로 이동했습니다. 전체 7개입니다.', { exact: true }),
  ).toBeAttached()
  await page.keyboard.press('Space')
  await expect(informationHandle).not.toHaveAttribute('aria-pressed', 'true')

  await openSection(page, '프로젝트')
  const firstProject = '디어마이홈 서비스 모노레포 전환 및 리뉴얼 프로젝트'
  const secondProject = '디어마이홈 Flutter 하이브리드 앱 개발 프로젝트'
  const firstProjectHandle = page.getByRole('button', { name: `${firstProject} 순서 변경` })
  await firstProjectHandle.focus()
  await page.keyboard.press('Space')
  await expect(firstProjectHandle).toHaveAttribute('aria-pressed', 'true')
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  )
  await page.keyboard.press('ArrowDown')
  await expect(
    page.getByText('2번째 위치로 이동했습니다. 전체 9개입니다.', { exact: true }),
  ).toBeAttached()
  await page.keyboard.press('Space')
  await expect(firstProjectHandle).not.toHaveAttribute('aria-pressed', 'true')
  await expect(preview.getByText(secondProject)).toBeVisible()

  await expect
    .poll(() =>
      preview
        .locator('[data-preview-region-id="project-2"], [data-preview-region-id="project-1"]')
        .evaluateAll((elements) =>
          elements.map((element) => element.getAttribute('data-preview-region-id')),
        ),
    )
    .toEqual(['project-2', 'project-1'])

  const { text } = await downloadResume(page)
  const exported = JSON.parse(text) as {
    sections: Array<{ id: string; type: string; data: { items?: Array<{ id: string }> } }>
  }
  expect(exported.sections.slice(0, 2).map(({ id }) => id)).toEqual([
    'section-introduce',
    'section-information',
  ])
  expect(
    exported.sections
      .find(({ type }) => type === 'projects')
      ?.data.items?.slice(0, 2)
      .map(({ id }) => id),
  ).toEqual(['project-2', 'project-1'])
})

test('company 추가·수정·삭제의 취소와 확인을 지원한다', async ({ page }, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  await openSection(page, '경력')
  await page.getByRole('button', { name: '회사 추가' }).click()
  const companyName = page.getByLabel('회사명').last()
  await companyName.fill('추가 회사')
  const deleteButton = page.getByRole('button', { name: '추가 회사 회사 삭제' })

  page.once('dialog', async (dialog) => dialog.dismiss())
  await deleteButton.click()
  await expect(companyName).toHaveValue('추가 회사')

  page.once('dialog', async (dialog) => dialog.accept())
  await deleteButton.click()
  await expect(page.getByLabel('회사명')).toHaveCount(5)
})

test('reload에서 초안을 복구하고 초기화하면 canonical 값으로 돌아간다', async ({
  page,
}, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  const title = page.getByLabel('이력서 제목')
  await title.fill('복구할 초안')
  await expect
    .poll(() =>
      page.evaluate(() => {
        const raw = sessionStorage.getItem('resume-editor:draft:v1')
        if (raw === null) return null
        return (JSON.parse(raw) as { draft: { metadata: { title: string } } }).draft.metadata.title
      }),
    )
    .toBe('복구할 초안')
  await page.reload()
  await expect(page.getByTestId('preview-status')).toHaveText('연결됨')
  await expect(page.getByLabel('이력서 제목')).toHaveValue('복구할 초안')

  page.once('dialog', async (dialog) => dialog.accept())
  await page.getByRole('button', { name: '초안 초기화' }).click()
  await expect(page.getByLabel('이력서 제목')).toHaveValue('Resume 편도걸')
  await expect(page.getByText('원본 이력서로 초기화했습니다')).toBeVisible()
})

test('닫힌 section의 nested 필수 오류는 export를 막고 summary action이 field로 반복 이동한다', async ({
  page,
}, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  await openSection(page, '경력')
  const companyName = page.getByLabel('회사명').first()
  await companyName.fill('')
  await page.getByRole('button', { name: '경력', exact: true }).click()
  let downloadStarted = false
  page.once('download', () => {
    downloadStarted = true
  })
  await page.getByRole('button', { name: 'JSON 내보내기' }).click()
  const summaryAction = page.getByRole('button', { name: '첫 번째 오류로 이동' })
  await expect(summaryAction).toBeVisible()
  await expect(page.getByRole('button', { name: '경력', exact: true })).toHaveAttribute(
    'aria-expanded',
    'true',
  )
  await expect(companyName).toBeVisible()
  await expect(companyName).toBeFocused()
  await page.getByLabel('역할').first().focus()
  await summaryAction.click()
  await expect(companyName).toBeFocused()
  expect(downloadStarted).toBe(false)
})

test('현재 asset 요청이 pending이면 export를 막고 성공 callback 뒤 허용한다', async ({
  page,
}, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  let releaseAsset: () => void = () => undefined
  const assetGate = new Promise<void>((resolve) => {
    releaseAsset = resolve
  })
  await page.route('**/profile/pending-image.webp', async (route) => {
    await assetGate
    await route.fulfill({
      status: 200,
      contentType: 'image/svg+xml',
      body: '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>',
    })
  })
  await waitForEditor(page)
  const assetInput = page.getByLabel('앞면 프로필 이미지 경로')
  await assetInput.fill('/profile/pending-image.webp')
  await expect(assetInput).toHaveAttribute('aria-invalid', 'true')
  const describedBy = await assetInput.getAttribute('aria-describedby')
  expect(describedBy).not.toBeNull()
  await expect(page.locator(`#${describedBy}`)).toHaveText(
    '이미지 확인이 끝날 때까지 기다려 주세요',
  )

  let downloadCount = 0
  page.on('download', () => {
    downloadCount += 1
  })
  await page.getByRole('button', { name: 'JSON 내보내기' }).click()
  await page.waitForTimeout(100)
  expect(downloadCount).toBe(0)
  await expect(page.getByRole('heading', { name: '내보내기 오류' })).toBeVisible()
  await expect(assetInput).toBeFocused()

  releaseAsset()
  await expect(assetInput).toHaveAttribute('aria-invalid', 'false')
  const { filename } = await downloadResume(page)
  expect(filename).toBe('resume.json')
})

test('valid export는 filename, 수정값, 2칸 들여쓰기와 마지막 newline을 보존한다', async ({
  page,
}, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  await page.getByLabel('이력서 제목').fill('내보낸 이력서')
  const { filename, text } = await downloadResume(page)
  expect(filename).toBe('resume.json')
  const parsed = JSON.parse(text) as { metadata: { title: string } }
  expect(parsed.metadata.title).toBe('내보낸 이력서')
  expect(text).toBe(`${JSON.stringify(parsed, null, 2)}\n`)
  expect(text).toContain('\n  "schemaVersion": 1,')
  expect(text.endsWith('\n')).toBe(true)
})

test('actual mode는 selection attribute를 iframe에서 제거한다', async ({ page }, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  const preview = page.frameLocator('iframe[title="실제 이력서 프리뷰"]')
  await expect(preview.locator('[data-preview-region-id]')).not.toHaveCount(0)
  await page.getByRole('button', { name: '실제 화면' }).click()
  await expect(preview.locator('[data-preview-region-id]')).toHaveCount(0)
  await page.getByRole('button', { name: '선택 모드' }).click()
  await expect(preview.locator('[data-preview-region-id]')).not.toHaveCount(0)
})

test('잘못된 image path는 form error와 preview alt text를 함께 유지한다', async ({
  page,
}, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await waitForEditor(page)
  const assetInput = page.getByLabel('앞면 프로필 이미지 경로')
  await assetInput.fill('/profile/missing-image.webp')
  await expect(assetInput).toHaveAttribute('aria-invalid', 'true')
  const describedBy = await assetInput.getAttribute('aria-describedby')
  expect(describedBy).not.toBeNull()
  const assetError = page.locator(`#${describedBy}`)
  await expect(assetError).toBeVisible()
  await expect(assetError).toHaveText('이미지를 불러올 수 없습니다')
  const preview = page.frameLocator('iframe[title="실제 이력서 프리뷰"]')
  await expect(preview.getByRole('img', { name: '편도걸 프로필 앞면' })).toBeVisible()
})

test('/resume에는 dev marker, selection attribute와 editor message code가 없다', async ({
  page,
}) => {
  await page.goto('/resume')
  await expect(page.locator('[data-resume-editor-client-marker]')).toHaveCount(0)
  await expect(page.locator('[data-preview-region-id]')).toHaveCount(0)
  await expect(page.locator('body')).not.toContainText('SELECT_REGION')
  await expect(page.locator('body')).not.toContainText('RENDER_DRAFT')
})

test('editor desktop 시각 기준선을 유지한다 @visual', async ({ page }, testInfo) => {
  skipUnless(testInfo.project.name, 'desktop')
  await page.clock.setFixedTime(new Date('2026-07-12T00:00:00.000Z'))
  await waitForEditor(page)
  await expect(page.getByText('초안 저장됨: 2026-07-12T00:00:00.000Z')).toBeVisible()
  await page.getByRole('button', { name: 'JSON 내보내기' }).focus()
  await expect(page).toHaveScreenshot('resume-editor-desktop.png')
})

test('editor mobile edit 시각 기준선을 유지한다 @visual', async ({ page }, testInfo) => {
  skipUnless(testInfo.project.name, 'mobile')
  await page.clock.setFixedTime(new Date('2026-07-12T00:00:00.000Z'))
  await waitForEditor(page)
  await expect(page.getByText('초안 저장됨: 2026-07-12T00:00:00.000Z')).toBeVisible()
  await page.getByRole('button', { name: 'JSON 내보내기' }).focus()
  await expect(page).toHaveScreenshot('resume-editor-mobile-edit.png')
})

test('editor mobile preview 시각 기준선을 유지한다 @visual', async ({ page }, testInfo) => {
  skipUnless(testInfo.project.name, 'mobile')
  await page.clock.setFixedTime(new Date('2026-07-12T00:00:00.000Z'))
  await waitForEditor(page)
  await expect(page.getByText('초안 저장됨: 2026-07-12T00:00:00.000Z')).toBeVisible()
  await page.getByRole('tab', { name: '프리뷰' }).click()
  await page.getByRole('radio', { name: '모바일 390×844' }).check()
  await page.getByRole('button', { name: '실제 화면' }).focus()
  await expect(page).toHaveScreenshot('resume-editor-mobile-preview.png')
})
