import { ChangeEvent, KeyboardEvent } from 'react'

export interface IInputProps {
  wrapperClass?: string
  id?: string
  value?: number | string | undefined
  name?: string
  disabled?: boolean
  readOnly?: boolean
  className?: string
  size?: 'small' | 'medium' | 'large'
  type?: 'text' | 'number' | 'tel' | 'password'
  placeholder?: string
  inputMode?: TInputMode
  pattern?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>, value?: TInputValue) => void
  onBlur?: (e: ChangeEvent<HTMLInputElement>, value?: TInputValue) => void
  onEnter?: (e: KeyboardEvent<HTMLInputElement>, value?: TInputValue) => void
}

type TInputValue = number | string | undefined
type TInputMode = 'none' | 'text' | 'decimal' | 'numeric' | 'tel' | 'search' | 'email' | 'url'

export const sizeClasses = {
  small: 'px-[1.0rem] py-[0.6rem] text-[1.2rem]',
  medium: 'px-[1.2rem] py-[0.8rem] text-[1.4rem]',
  large: 'px-[1.2rem] py-[1.2rem] text-[1.6rem]',
} as const

export const iconSizeClasses = {
  small: 'w-[1.2rem] h-[1.2rem]',
  medium: 'w-[1.6rem] h-[1.6rem]',
  large: 'w-[1.8rem] h-[1.8rem]',
}
export const passwordClasses = {
  small: 'pr-[2.8rem]',
  medium: 'pr-[3.2rem]',
  large: 'pr-[3.4rem]',
}
