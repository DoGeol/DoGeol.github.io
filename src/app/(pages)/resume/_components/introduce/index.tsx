import { Fragment } from 'react'
import dayjs from 'dayjs'

import SectionTitle from '@/app/(pages)/resume/_components/common/section-title'
import type { IntroduceSection } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import HighlightedText from '@/features/highlighted-text'
import { cn } from '@/shared/lib/tailwindcss'

interface Props {
  section: IntroduceSection
  renderRegion: ResumeRegionRenderer
}

const Introduce = ({ section, renderRegion }: Props) => {
  if (!section.visible) return null

  return renderRegion({
    id: section.id,
    type: 'section',
    label: '소개',
    children: (
      <article className={cn('px-6 py-4', 'flex flex-col items-start justify-start gap-4')}>
        <SectionTitle>Introduce</SectionTitle>
        <div className="h-full w-full space-y-3.5 break-keep">
          {section.data.paragraphs.map((paragraph) => (
            <Fragment key={paragraph.id}>
              {renderRegion({
                id: paragraph.id,
                type: 'text',
                label: '소개 문단',
                children: (
                  <p className="leading-relaxed">
                    <HighlightedText text={paragraph.text} useUnderline={false} />
                  </p>
                ),
              })}
            </Fragment>
          ))}
        </div>
        <div className="flex w-full flex-col items-end justify-end text-sm font-extralight">
          <p className="inline-flex items-center justify-center gap-x-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-4 fill-green-400"
            >
              <path
                fillRule="evenodd"
                d="M16.403 12.652a3 3 0 0 0 0-5.304 3 3 0 0 0-3.75-3.751 3 3 0 0 0-5.305 0 3 3 0 0 0-3.751 3.75 3 3 0 0 0 0 5.305 3 3 0 0 0 3.75 3.751 3 3 0 0 0 5.305 0 3 3 0 0 0 3.751-3.75Zm-2.546-4.46a.75.75 0 0 0-1.214-.883l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
                clipRule="evenodd"
              />
            </svg>
            Latest Updated
          </p>
          <p className="text-sm">{dayjs(section.data.updatedAt).format('YYYY. MM. DD')}</p>
        </div>
      </article>
    ),
  })
}

export default Introduce
