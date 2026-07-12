'use client'

import { useId, useMemo, useState } from 'react'

import type { ResumeDraft } from '@/app/(pages)/resume/_model/resume-schema'

import {
  skillCategoryOptions,
  type SkillCategory,
} from '@/app/(dev)/resume-editor/_components/skills/skill-editor-options'

type CatalogSkill = ResumeDraft['skillCatalog'][number]
type CategoryFilter = 'all' | SkillCategory

type SkillReferencePickerProps = {
  catalog: readonly CatalogSkill[]
  selectedSkillIds: readonly string[]
  onToggle: (skillId: string, checked: boolean) => void
}

export function SkillReferencePicker({
  catalog,
  selectedSkillIds,
  onToggle,
}: SkillReferencePickerProps) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<CategoryFilter>('all')
  const filteredCatalog = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase()
    return catalog.filter(
      (skill) =>
        (category === 'all' || skill.category === category) &&
        (normalizedQuery === '' ||
          skill.id.toLocaleLowerCase().includes(normalizedQuery) ||
          skill.label.toLocaleLowerCase().includes(normalizedQuery)),
    )
  }, [catalog, category, query])

  if (catalog.length === 0) {
    return <p className="text-sm text-slate-500">등록된 기술이 없습니다.</p>
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
        className="rounded border px-3 py-2 text-sm"
      >
        {open ? '기술 선택기 닫기' : '기술 선택기 열기'}
      </button>
      {open && (
        <div id={panelId} className="space-y-3 rounded-md border border-slate-200 p-3">
          <label className="block space-y-1 text-sm">
            <span className="font-medium">기술 검색</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="w-full rounded-md border border-slate-500 bg-white px-3 py-2 text-slate-950 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-100"
            />
          </label>
          <label className="block space-y-1 text-sm">
            <span className="font-medium">기술 분류 필터</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value as CategoryFilter)}
              className="w-full rounded-md border border-slate-500 bg-white px-3 py-2 text-slate-950 dark:border-neutral-400 dark:bg-neutral-800 dark:text-neutral-100"
            >
              <option value="all">전체</option>
              {skillCategoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="max-h-72 space-y-2 overflow-y-auto">
            {filteredCatalog.map((skill) => {
              const selectedIndex = selectedSkillIds.indexOf(skill.id)
              return (
                <label key={skill.id} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={selectedIndex >= 0}
                    onChange={(event) => onToggle(skill.id, event.target.checked)}
                  />
                  {skill.label || skill.id}
                  {selectedIndex >= 0 && (
                    <span className="text-slate-500">선택 {selectedIndex + 1}</span>
                  )}
                </label>
              )
            })}
            {filteredCatalog.length === 0 && (
              <p className="text-sm text-slate-500">조건에 맞는 기술이 없습니다.</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
