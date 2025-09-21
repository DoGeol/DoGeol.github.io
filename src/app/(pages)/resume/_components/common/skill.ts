export type SkillCategory = 'frontend' | 'app' | 'backend' | 'devops' | 'collaboration' | 'etc'

export interface SkillDefinition {
  name: string
  iconUrl: string
  type: SkillCategory
}

export const SKILLS = [
  // Frontend
  { name: 'react.js', iconUrl: '', type: 'frontend' },
  { name: 'html/css', iconUrl: '', type: 'frontend' },
  { name: 'vue.js', iconUrl: '', type: 'frontend' },
  { name: 'typescript', iconUrl: '', type: 'frontend' },
  { name: 'zustand', iconUrl: '', type: 'frontend' },
  { name: 'react-query', iconUrl: '', type: 'frontend' },
  { name: 'react-hook-form', iconUrl: '', type: 'frontend' },
  { name: 'redux', iconUrl: '', type: 'frontend' },
  { name: 'redux-toolkit', iconUrl: '', type: 'frontend' },
  { name: 'redux-saga', iconUrl: '', type: 'frontend' },
  { name: 'vuex', iconUrl: '', type: 'frontend' },
  { name: 'jQuery', iconUrl: '', type: 'frontend' },
  { name: 'ant-design', iconUrl: '', type: 'frontend' },
  { name: 'daisyUI', iconUrl: '', type: 'frontend' },
  { name: 'element-ui', iconUrl: '', type: 'frontend' },
  { name: 'shardcn/ui', iconUrl: '', type: 'frontend' },
  { name: 'tailwind-css', iconUrl: '', type: 'frontend' },
  { name: 'emotion', iconUrl: '', type: 'frontend' },
  { name: 'styled-components', iconUrl: '', type: 'frontend' },
  { name: 'sass', iconUrl: '', type: 'frontend' },
  { name: 'next.js', iconUrl: '', type: 'frontend' },
  { name: 'next.js 15 app router', iconUrl: '', type: 'frontend' },
  { name: 'next.js 14 app router', iconUrl: '', type: 'frontend' },
  { name: 'next.js 13 app router', iconUrl: '', type: 'frontend' },
  { name: 'next.js page router', iconUrl: '', type: 'frontend' },
  { name: 'nuxt.js', iconUrl: '', type: 'frontend' },

  // App
  { name: 'dart', iconUrl: '', type: 'app' },
  { name: 'flutter', iconUrl: '', type: 'app' },
  { name: 'firebase_message 4', iconUrl: '', type: 'app' },
  { name: 'webview_flutter 3', iconUrl: '', type: 'app' },

  // Backend
  { name: 'java', iconUrl: '', type: 'backend' },
  { name: 'spring boot', iconUrl: '', type: 'backend' },
  { name: 'node.js', iconUrl: '', type: 'backend' },
  { name: 'express.js', iconUrl: '', type: 'backend' },
  { name: 'mysql', iconUrl: '', type: 'backend' },

  // DevOps
  { name: 'turborepo', iconUrl: '', type: 'devops' },
  { name: 'ubuntu linux', iconUrl: '', type: 'devops' },
  { name: 'apache', iconUrl: '', type: 'devops' },
  { name: 'nginx', iconUrl: '', type: 'devops' },
  { name: 'jenkins', iconUrl: '', type: 'devops' },
  { name: 'github-actions', iconUrl: '', type: 'devops' },
  { name: 'aws', iconUrl: '', type: 'devops' },
  { name: 'aws codeDeploy', iconUrl: '', type: 'devops' },
  { name: 'aws ec2', iconUrl: '', type: 'devops' },

  // Collaboration
  { name: 'git', iconUrl: '', type: 'collaboration' },
  { name: 'github', iconUrl: '', type: 'collaboration' },
  { name: 'gitlab', iconUrl: '', type: 'collaboration' },
  { name: 'jira', iconUrl: '', type: 'collaboration' },
  { name: 'confluence', iconUrl: '', type: 'collaboration' },
] as const

export type SkillName = (typeof SKILLS)[number]['name']
