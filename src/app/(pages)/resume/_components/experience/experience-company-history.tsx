import { Fragment } from 'react'

import type { ExperienceSection, SkillDefinition } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'

import ExperienceSkills from '@/app/(pages)/resume/_components/experience/experience-skills'

type HistoryItem = ExperienceSection['data']['items'][number]['histories'][number]

interface Props {
  history: HistoryItem
  isShowPeriod?: boolean
  skillCatalog: SkillDefinition[]
  renderRegion: ResumeRegionRenderer
}

const formatDate = (date: string) => date.substring(0, 7).replace('-', '.')

const ExperienceCompanyHistory = ({
  history,
  isShowPeriod = true,
  skillCatalog,
  renderRegion,
}: Props) =>
  renderRegion({
    id: history.id,
    type: 'history',
    label: `${history.department} ${history.role}`,
    children: (
      <li className="grid gap-1">
        <div className="flex items-center gap-2 text-base">
          <p className="font-semibold text-neutral-700 dark:text-neutral-200">
            {history.department}
          </p>
          <span className="text-neutral-500 dark:text-neutral-400">/</span>
          <p className="text-neutral-500 dark:text-neutral-400">{history.role}</p>
        </div>
        {isShowPeriod && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {formatDate(history.startDate)} ~ {history.endDate && formatDate(history.endDate)}
          </p>
        )}
        <div className="mt-3 pl-3">
          <ul className="flex list-outside list-disc flex-col gap-1 pl-5">
            {history.works.map((work) => (
              <Fragment key={work.id}>
                {renderRegion({
                  id: work.id,
                  type: 'text',
                  label: '경력 업무',
                  children: <li>{work.text}</li>,
                })}
              </Fragment>
            ))}
            <ExperienceSkills
              skillReferences={history.skills}
              skillCatalog={skillCatalog}
              renderRegion={renderRegion}
            />
          </ul>
        </div>
      </li>
    ),
  })

export default ExperienceCompanyHistory
