import type { ComponentType } from 'react'

export type ComponentSlug = 'accordion' | 'input'
export type SourceId = 'accordion-root' | 'input' | 'accordion-examples' | 'input-examples'

export type ComponentDoc = Readonly<{
  slug: ComponentSlug
  title: string
  description: string
  category: 'Disclosure' | 'Form'
  sections: readonly Readonly<{ id: string; label: string }>[]
  sourceIds: readonly SourceId[]
  load: () => Promise<{ default: ComponentType }>
}>

const standardSections = [
  { id: 'usage', label: 'Usage' },
  { id: 'examples', label: 'Examples' },
  { id: 'props', label: 'Props' },
  { id: 'source', label: 'Source' },
  { id: 'known-limitations', label: 'Known limitations' },
] as const

export const componentDocs = [
  {
    slug: 'accordion',
    title: 'Accordion',
    description: '관련 콘텐츠를 펼치고 접어 화면의 정보 밀도를 조절합니다.',
    category: 'Disclosure',
    sections: standardSections,
    sourceIds: ['accordion-root', 'accordion-examples'],
    load: () => import('../content/accordion.mdx'),
  },
  {
    slug: 'input',
    title: 'Input',
    description: '크기, 비밀번호 표시, Enter 동작을 지원하는 텍스트 입력입니다.',
    category: 'Form',
    sections: standardSections,
    sourceIds: ['input', 'input-examples'],
    load: () => import('../content/input.mdx'),
  },
] as const satisfies readonly ComponentDoc[]

export function getComponentDoc(slug: string): ComponentDoc | undefined {
  return componentDocs.find((doc) => doc.slug === slug)
}

export function getAdjacentDocs(slug: string) {
  const index = componentDocs.findIndex((doc) => doc.slug === slug)
  return {
    previous: index > 0 ? componentDocs[index - 1] : undefined,
    next: index >= 0 && index < componentDocs.length - 1 ? componentDocs[index + 1] : undefined,
  }
}
