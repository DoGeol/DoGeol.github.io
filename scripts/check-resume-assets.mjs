import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

export const collectResumeAssetPaths = (resume) => {
  const paths = [resume.assets.profileFront, resume.assets.profileBack]

  for (const section of resume.sections) {
    if (section.type !== 'experience') continue
    for (const experience of section.data.items) paths.push(experience.logoPath)
  }

  return [...new Set(paths)]
}

export const assertResumeAssets = (repositoryRoot, resume) => {
  const resolvedRepositoryRoot = path.resolve(repositoryRoot)
  const publicRoot = path.resolve(repositoryRoot, 'public')
  const missing = []

  for (const assetPath of collectResumeAssetPaths(resume)) {
    const isRepositoryFilePath =
      typeof assetPath === 'string' &&
      (assetPath === resolvedRepositoryRoot ||
        assetPath.startsWith(`${resolvedRepositoryRoot}${path.sep}`))
    if (typeof assetPath !== 'string' || !assetPath.startsWith('/') || isRepositoryFilePath) {
      throw new Error(`Resume asset path must be a root-relative URL: ${String(assetPath)}`)
    }

    const candidate = path.resolve(publicRoot, assetPath.slice(1))
    const isInside = candidate.startsWith(`${publicRoot}${path.sep}`)
    if (!isInside) {
      throw new Error(
        `Resume asset path cannot escape public with .. or an absolute path: ${assetPath}`,
      )
    }

    if (!existsSync(candidate)) missing.push(assetPath)
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing resume assets:\n${missing.map((assetPath) => `- ${assetPath}`).join('\n')}`,
    )
  }
}

const repositoryRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const main = () => {
  const resumePath = path.join(repositoryRoot, 'src/app/(pages)/resume/_data/resume.json')
  const resume = JSON.parse(readFileSync(resumePath, 'utf8'))
  assertResumeAssets(repositoryRoot, resume)
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main()
}
