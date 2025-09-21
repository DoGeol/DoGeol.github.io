import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import ProfileImage from '@/app/(pages)/resume/_components/infomation/profile-image'
import information from '@/app/(pages)/resume/_infos/information'
import Contacts from '@/app/(pages)/resume/_components/infomation/contacts'

const Information = () => {
  return (
    <article
      className={cn(
        'px-6 py-4',
        'tablet:flex-row tablet:justify-start tablet:items-start flex flex-col items-center justify-center gap-4',
        'tablet:text-left text-center',
      )}
    >
      <ProfileImage />
      <div className={'h-full w-full space-y-4 p-4'}>
        <h2
          className={cn(
            'tablet:text-4xl text-3xl break-keep',
            '[&_strong]:from-primary-500 [&_strong]:to-primary-400 [&_strong]:bg-linear-to-r [&_strong]:bg-clip-text [&_strong]:text-transparent',
          )}
          dangerouslySetInnerHTML={{ __html: information.introduceText }}
        />
        <Contacts contactList={information.contactList || []} />
      </div>
    </article>
  )
}

export default Information
