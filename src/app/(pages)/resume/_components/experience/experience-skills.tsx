import React from 'react'
import { SKILLS } from '@/app/(pages)/resume/_components/common/skill'
import SkillBadge from '@/app/(pages)/resume/_components/common/skill-badge'
import { History } from './types'

type Props = {
  skillNameList: History['skillNameList']
}

const ExperienceSkills = ({ skillNameList }: Props) => {
  if (!skillNameList || skillNameList.length === 0) {
    return null
  }

  return (
    <li className={'space-y-2'}>
      <p>기술 키워드</p>
      <div className={'flex flex-wrap gap-1'}>
        {skillNameList.map((skillName) => {
          const skill = SKILLS.find((s) => s.name === skillName)
          if (!skill) return null
          return <SkillBadge key={skillName} skillName={skillName} category={skill.type} />
        })}
      </div>
    </li>
  )
}

export default ExperienceSkills
