'use client'

import { useEffect } from 'react'

export function ArticleEnhancements() {
  useEffect(() => {
    const article = document.querySelector('[data-blog-article-body]')
    if (!(article instanceof HTMLElement)) return
    const blocks = Array.from(article.querySelectorAll('[data-content-type="codeBlock"]'))
    const cleanups = blocks.map((block) => {
      if (!(block instanceof HTMLElement) || block.querySelector('[data-code-copy]'))
        return () => undefined
      const button = document.createElement('button')
      button.type = 'button'
      button.textContent = '복사'
      button.dataset.codeCopy = ''
      button.className = 'blog-code-copy'
      const copy = async () => {
        const code = block.querySelector('code')?.textContent ?? block.textContent ?? ''
        await navigator.clipboard.writeText(code.replace(/복사$/, '').trim())
        button.textContent = '복사됨'
        window.setTimeout(() => (button.textContent = '복사'), 1200)
      }
      button.addEventListener('click', copy)
      block.append(button)
      return () => button.removeEventListener('click', copy)
    })
    return () => cleanups.forEach((cleanup) => cleanup())
  }, [])
  return null
}
