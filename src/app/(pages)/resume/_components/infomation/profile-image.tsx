import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'

interface Props {
  frontPath: string
  backPath: string
  classNames?: string
}

const ProfileImage = ({ frontPath, backPath, classNames = 'h-40 w-40' }: Props) => {
  const CommonCircleImageClasses = cn(
    'absolute top-0 left-0 h-full w-full overflow-hidden',
    'border border-solid rounded-full',
    'backface-visibility-hidden',
    'bg-cover bg-bottom bg-no-repeat',
    'transition-all duration-500 ease-in-out',
  )
  return (
    <div
      className={cn(
        'hover:[&_.front]:transform-rotate-y-180 hover:[&_.back]:transform-rotate-y-0 shrink-0',
        classNames,
      )}
      style={{ perspective: '500px' }}
    >
      <div
        className={cn(CommonCircleImageClasses, 'front transform-rotate-y-0 bg-neutral-200')}
        style={{ backgroundImage: `url(${frontPath})` }}
        role="img"
        aria-label="편도걸 프로필 앞면"
      />
      <div
        className={cn(CommonCircleImageClasses, 'back transform-rotate-y-180-back bg-neutral-200')}
        style={{ backgroundImage: `url(${backPath})` }}
        role="img"
        aria-label="편도걸 프로필 뒷면"
      />
    </div>
  )
}

export default ProfileImage
