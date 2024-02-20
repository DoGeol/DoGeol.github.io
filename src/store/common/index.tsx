import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

type TState = {}

type TAction = {}

const store = (set: any, get: any): TState & TAction => ({})

export const useCommonStore = create<TState & TAction>()(
  devtools(immer(store), { enabled: process.env.NODE_ENV !== 'production' }),
)
