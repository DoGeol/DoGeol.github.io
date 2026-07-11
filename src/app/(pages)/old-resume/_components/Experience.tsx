import React from 'react'
import { TExperience } from '@/app/(pages)/old-resume/_constant/types'
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTitle,
} from '@/shared/ui/Accordion'

type TProps = {
  data: TExperience
}
export default function Experience({ data }: TProps): React.JSX.Element {
  return (
    <div className={'flex flex-col justify-start'}>
      <h2
        className={
          'text-title bg-linear-to-r from-blue-500 to-sky-100 bg-clip-text font-bold text-transparent'
        }
      >
        Experience
      </h2>
      <div className={'h-px w-full bg-blue-600 dark:bg-blue-200'} />
      <div className={'text-desc flex flex-col'}>
        {data?.map((company) => (
          <div
            className={
              'text-desc tablet:grid-cols-3 tablet:gap-1.5 grid grid-cols-1 gap-10 border-b border-dotted border-blue-200 py-10'
            }
            key={company.id}
          >
            <div className={'col-span-1'}>
              <strong className={'text-sub-title'}>{company.companyName}</strong>
              <p>
                {company.period[0]} ~ {company.period[1]}
              </p>
              <p className={'text-gray-500'}>
                {company.department} / {company.jobPosition}
              </p>
              <ul className={'mt-1.5 flex flex-wrap items-center justify-start gap-1'}>
                {company.stack?.map((key, idx) => (
                  <li
                    key={`${key}_${idx}`}
                    className={`rounded-3xl bg-gray-200 px-2.5 py-1 text-base dark:bg-gray-500 dark:text-white`}
                  >
                    # {key}
                  </li>
                ))}
              </ul>
            </div>
            <div className={'tablet:col-span-2 col-span-1 flex flex-col gap-10'}>
              <div className={'flex flex-col items-start justify-start gap-6'}>
                <div
                  className={
                    'before:contents-[""] relative pl-4 before:absolute before:top-0 before:left-0 before:h-full before:w-1 before:bg-neutral-600 dark:before:bg-neutral-300'
                  }
                >
                  <p dangerouslySetInnerHTML={{ __html: company.description }}></p>
                </div>
                <div className={'pl-3'}>
                  <ul className={'text-desc font-light text-gray-500 dark:text-gray-400'}>
                    {company.summary?.map((item, idx) => (
                      <li key={`${item}_${idx}`} className={`tablet:pl-5 pc:pl-6 relative pl-3`}>
                        <span className={'absolute top-0 left-0'}>-</span>
                        <span
                          className={
                            '[&>span]:rounded-2xl [&>span]:bg-blue-400 [&>span]:px-2.5 [&>span]:text-white dark:[&>span]:bg-blue-600'
                          }
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <p className={'mb-3 font-extrabold'}>진행 프로젝트({company.project.length}개)</p>
                <AccordionRoot values={[]} rounded={true}>
                  {company.project?.map((item) => (
                    <AccordionItem value={item.id + ''} key={item.id}>
                      <AccordionTitle wrapperClass={'h-14 tablet:h-16 pc:h-20'} ellipsis>
                        <strong>{item.name}</strong>
                      </AccordionTitle>
                      <AccordionContent>
                        {item.summary && (
                          <>
                            <p className={'text-sub-desc font-medium'}>{item.summary}</p>
                            {/* 구분선 */}
                            <div
                              className={
                                'col-span-3 my-6 h-px w-full border border-dotted border-gray-200 dark:border-gray-200'
                              }
                            />
                          </>
                        )}
                        {item.details.length > 0 && (
                          <>
                            <ul className={'tablet:text-sub-desc font-light [&_strong]:font-bold'}>
                              {item.details?.map((detail, idx) => (
                                <li
                                  key={`${detail}_${idx}`}
                                  className={`tablet:pl-5 pc:pl-6 relative pl-3`}
                                >
                                  <span className={'absolute top-0 left-0'}>-</span>
                                  <span dangerouslySetInnerHTML={{ __html: detail }} />
                                </li>
                              ))}
                              <li className={`tablet:pl-5 pc:pl-6 relative pl-3`}>
                                <span className={'absolute top-0 left-0'}>-</span>
                                <span className={'flex items-start justify-start gap-1.5'}>
                                  <strong className={'shrink-0'}>개발 기간 : </strong>
                                  <span>
                                    {item.period[0]} ~ {item.period[1]}
                                  </span>
                                </span>
                              </li>
                              <li className={`tablet:pl-5 pc:pl-6 relative pl-3`}>
                                <span className={'absolute top-0 left-0'}>-</span>
                                <span className={'flex items-start justify-start gap-1.5'}>
                                  <strong className={'shrink-0'}>기술 스택 : </strong>
                                  <ul
                                    className={
                                      'mt-1 inline-flex flex-wrap items-center justify-start gap-1'
                                    }
                                  >
                                    {item.skills?.map((skill, idx) => (
                                      <li
                                        key={`${skill}_${idx}`}
                                        className={`rounded-3xl bg-gray-200 px-2.5 py-1 text-base dark:bg-gray-500 dark:text-white`}
                                      >
                                        # {skill}
                                      </li>
                                    ))}
                                  </ul>
                                </span>
                              </li>
                            </ul>
                          </>
                        )}
                        {item.roles.length > 0 && (
                          <>
                            {/* 구분선 */}
                            {item.details.length > 0 && (
                              <div
                                className={
                                  'col-span-3 my-6 h-px w-full border border-dotted border-gray-200 dark:border-gray-200'
                                }
                              />
                            )}
                            <ul className={'tablet:text-sub-desc font-light'}>
                              {item.roles?.map((role, idx) => (
                                <li
                                  key={`${role}_${idx}`}
                                  className={`tablet:pl-5 pc:pl-6 relative mt-1.5 pl-3 [&_strong]:font-bold dark:[&_strong]:text-gray-200`}
                                >
                                  <span className={'absolute top-0 left-0'}>{idx + 1}.</span>
                                  {typeof role === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: role }} />
                                  ) : (
                                    <>
                                      <div dangerouslySetInnerHTML={{ __html: role[0] }} />
                                      {Array.isArray(role[1]) &&
                                        role[1]?.map((detail) => (
                                          <div
                                            key={detail}
                                            className={'tablet:pl-5 pc:pl-6 relative pl-3'}
                                          >
                                            <span className={'absolute top-0 left-0'}>-</span>
                                            <p dangerouslySetInnerHTML={{ __html: detail }} />
                                          </div>
                                        ))}
                                    </>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </AccordionRoot>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
