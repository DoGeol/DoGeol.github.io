import { codeToHtml } from 'shiki'

export function highlightCode(code: string) {
  return codeToHtml(code, { lang: 'tsx', themes: { light: 'github-light', dark: 'github-dark' } })
}
