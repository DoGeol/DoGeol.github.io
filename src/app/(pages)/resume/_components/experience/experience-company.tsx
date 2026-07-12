import { Fragment } from 'react'

import type { ExperienceSection, SkillDefinition } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'
import HighlightedText from '@/features/highlighted-text'

import ExperienceCompanyHistory from '@/app/(pages)/resume/_components/experience/experience-company-history'
import {
  calculateExperiencePeriod,
  getCompanyPeriodText,
  getEmploymentStatusText,
} from '@/app/(pages)/resume/_components/experience/utils'

type ExperienceItem = ExperienceSection['data']['items'][number]

interface Props {
  experience: ExperienceItem
  skillCatalog: SkillDefinition[]
  renderRegion: ResumeRegionRenderer
}

const ExperienceCompany = ({ experience, skillCatalog, renderRegion }: Props) =>
  renderRegion({
    id: experience.id,
    type: 'experience',
    label: experience.companyName,
    children: (
      <li className="flex flex-col gap-4 border-b border-neutral-200 py-8 last:border-b-0 dark:border-neutral-700">
        <div className="flex items-center gap-3">
          <div className="inline-flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-neutral-100 bg-white dark:border-neutral-600">
            <img
              className="w-full"
              src={experience.logoPath}
              alt={`${experience.companyName} 로고`}
            />
          </div>
          <div className="flex flex-col">
            <h3 className="text-2xl font-bold text-neutral-800 dark:text-neutral-50">
              {experience.companyName}
            </h3>
            <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
              <span>{getCompanyPeriodText(experience)}</span>
              <span>({calculateExperiencePeriod(experience)})</span>
            </div>
            {experience.employmentStatus === 'recommended-retired' && (
              <div className="flex items-center gap-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                {getEmploymentStatusText(experience.employmentStatus)}
              </div>
            )}
          </div>
        </div>

        {experience.serviceSummary.length > 0 && (
          <div className="rounded-2xl bg-gray-50 px-4 py-3 font-light dark:bg-neutral-800">
            <ul className="flex list-outside list-disc flex-col gap-1 pl-5">
              {experience.serviceSummary.map((summary) => (
                <Fragment key={summary.id}>
                  {renderRegion({
                    id: summary.id,
                    type: 'text',
                    label: '서비스 요약',
                    children: (
                      <li className="break-keep whitespace-pre-wrap">
                        <HighlightedText text={summary.text} useUnderline />
                      </li>
                    ),
                  })}
                </Fragment>
              ))}
            </ul>
          </div>
        )}

        {experience.experienceSummary.length > 0 && (
          <div className="tablet:space-y-0.5 space-y-2 px-4">
            {experience.experienceSummary.map((summary) => (
              <Fragment key={summary.id}>
                {renderRegion({
                  id: summary.id,
                  type: 'text',
                  label: '경력 요약',
                  children: (
                    <p className="break-all whitespace-pre-wrap">
                      <HighlightedText text={summary.text} useUnderline />
                    </p>
                  ),
                })}
              </Fragment>
            ))}
          </div>
        )}

        <ul className="mt-2 flex flex-col gap-4">
          {experience.histories.map((history) => (
            <Fragment key={history.id}>
              <ExperienceCompanyHistory
                history={history}
                isShowPeriod={experience.histories.length > 1}
                skillCatalog={skillCatalog}
                renderRegion={renderRegion}
              />
            </Fragment>
          ))}
        </ul>
      </li>
    ),
  })

export default ExperienceCompany
