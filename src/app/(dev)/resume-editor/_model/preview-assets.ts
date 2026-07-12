import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

export type ResumeAssetFieldPath =
  'assets.profileFront' | 'assets.profileBack' | `sections.${number}.data.items.${number}.logoPath`

export interface PreviewAsset {
  fieldPath: ResumeAssetFieldPath
  url: string
}

export const collectPreviewAssets = (draft: ResumeDraft): PreviewAsset[] => {
  const assets: PreviewAsset[] = [
    { fieldPath: 'assets.profileFront', url: draft.assets.profileFront },
    { fieldPath: 'assets.profileBack', url: draft.assets.profileBack },
  ]

  draft.sections.forEach((section, sectionIndex) => {
    if (section.type !== 'experience') return
    section.data.items.forEach((item, itemIndex) => {
      assets.push({
        fieldPath: `sections.${sectionIndex}.data.items.${itemIndex}.logoPath`,
        url: item.logoPath,
      })
    })
  })

  return assets
}
