'use client'

import { useState } from 'react'
import Input from '@/shared/ui/Input'

export function InputBasicExample() {
  return (
    <div className="w-full max-w-sm space-y-3">
      <Input aria-label="이름" placeholder="이름을 입력하세요" />
      <Input aria-label="작은 입력" size="small" placeholder="Small" />
      <Input aria-label="비활성 입력" disabled placeholder="Disabled" />
    </div>
  )
}

export function InputPasswordExample() {
  return (
    <div className="w-full max-w-sm">
      <Input aria-label="비밀번호" type="password" placeholder="비밀번호" />
    </div>
  )
}

export function InputEnterExample() {
  const [message, setMessage] = useState('Enter를 눌러보세요.')
  return (
    <div className="w-full max-w-sm space-y-2">
      <Input aria-label="Enter 예제" onEnter={(_, value) => setMessage(`입력값: ${value}`)} />
      <p aria-live="polite" className="text-sm">
        {message}
      </p>
    </div>
  )
}
