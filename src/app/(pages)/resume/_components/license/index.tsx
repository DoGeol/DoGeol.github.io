import React from 'react'
import { cn } from '@/shared/lib/tailwindcss'
import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import license from '@/app/(pages)/resume/_infos/license'

const License = () => {
  return (
    <>
      {license.isShow && license.licenseList.length > 0 && (
        <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
          <SectionTitle>License & Certificate</SectionTitle>
          <div className={'h-full w-full space-y-4 break-keep'}>
            {license.licenseList.map((license) => (
              <div key={license.title}>
                <p className={'text-xl font-bold'}>{license.title}</p>
                <div
                  className={
                    'flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400'
                  }
                >
                  <p>{license.date}</p>
                  <span>/</span>
                  <p className={'capitalize'}>{license.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </article>
      )}
    </>
  )
}

export default License
