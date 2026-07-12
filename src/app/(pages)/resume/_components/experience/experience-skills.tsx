import { Fragment } from 'react'

import SkillBadge from '@/app/(pages)/resume/_components/common/skill-badge'
import type { ExperienceSection, SkillDefinition } from '@/app/(pages)/resume/_model/resume-schema'
import type { ResumeRegionRenderer } from '@/app/(pages)/resume/_model/resume-region'

type HistoryItem = ExperienceSection['data']['items'][number]['histories'][number]

interface Props {
  skillReferences: HistoryItem['skills']
  skillCatalog: SkillDefinition[]
  renderRegion: ResumeRegionRenderer
}

const ExperienceSkills = ({ skillReferences, skillCatalog, renderRegion }: Props) => {
  if (skillReferences.length === 0) return null

  return (
    <li className="space-y-2">
      <p>기술 키워드</p>
      <div className="flex flex-wrap gap-1">
        {skillReferences.map((reference) => {
          const skill = skillCatalog.find(({ id }) => id === reference.skillId)
          if (!skill) return null
          return (
            <Fragment key={reference.id}>
              <SkillBadge
                skillName={skill.label}
                category={skill.category}
                regionId={reference.id}
                renderRegion={renderRegion}
              />
            </Fragment>
          )
        })}
      </div>
    </li>
  )
}

export default ExperienceSkills
