import type { InformationSection, ResumeData } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import HighlightedText from '@/features/highlighted-text'
import { cn } from '@/shared/lib/tailwindcss'

import Contacts from '@/app/(pages)/resume/_components/infomation/contacts'
import ProfileImage from '@/app/(pages)/resume/_components/infomation/profile-image'

interface Props {
  section: InformationSection
  assets: ResumeData['assets']
  renderRegion: ResumeRegionRenderer
}

const Information = ({ section, assets, renderRegion }: Props) => {
  if (!section.visible) return null

  return renderRegion({
    id: section.id,
    type: 'section',
    label: '기본 정보',
    children: (
      <article
        className={cn(
          'px-6 py-4',
          'tablet:flex-row tablet:justify-start tablet:items-start flex flex-col items-center justify-center gap-4',
          'tablet:text-left text-center',
        )}
      >
        <ProfileImage frontPath={assets.profileFront} backPath={assets.profileBack} />
        <div className="h-full w-full space-y-4 p-4">
          <h2
            className={cn(
              'tablet:text-4xl text-3xl break-keep',
              '[&_strong]:from-primary-500 [&_strong]:to-primary-400 [&_strong]:bg-linear-to-r [&_strong]:bg-clip-text [&_strong]:text-transparent',
            )}
          >
            <HighlightedText
              text={section.data.headline}
              className="font-bold"
              useUnderline={false}
            />
          </h2>
          <Contacts contactList={section.data.contacts} renderRegion={renderRegion} />
        </div>
      </article>
    ),
  })
}

export default Information
