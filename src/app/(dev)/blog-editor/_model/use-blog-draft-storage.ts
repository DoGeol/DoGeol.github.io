'use client'

import { useMemo, useSyncExternalStore } from 'react'

import { BLOG_DRAFT_STORAGE_KEY, parseBlogDrafts } from './draft-storage'

const subscribe = () => () => undefined
const getServerSnapshot = () => undefined
const getClientSnapshot = () => sessionStorage.getItem(BLOG_DRAFT_STORAGE_KEY)

export function useBlogDraftStorage() {
  const raw = useSyncExternalStore(subscribe, getClientSnapshot, getServerSnapshot)
  return useMemo(
    () => ({
      hydrated: raw !== undefined,
      state: parseBlogDrafts(raw ?? null),
    }),
    [raw],
  )
}
