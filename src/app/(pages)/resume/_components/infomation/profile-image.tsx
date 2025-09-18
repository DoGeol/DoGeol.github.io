import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'

interface Props {
  classNames?: string
}

const ProfileImage = ({classNames = 'h-40 w-40'} : Props) => {
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
        'shrink-0 hover:[&_.front]:transform-rotate-y-180 hover:[&_.back]:transform-rotate-y-0',
        classNames,
      )}
      style={{ perspective: '500px' }}
    >
      <div
        className={cn(
          CommonCircleImageClasses,
          'front transform-rotate-y-0 bg-[url("/profile/pdg-real.webp")]',
        )}
      />
      <div
        className={cn(
          CommonCircleImageClasses,
          'back transform-rotate-y-180-back bg-[url("/logo.png")]',
        )}
      />
    </div>
  )
}

export default ProfileImage
