import React from 'react'
import { TExperience } from '@/app/(pages)/(main)/_constant/types'
import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTitle,
} from '@/components/element/Accordion'

type TProps = {
  data: TExperience
}
export default function Experience({ data }: TProps): React.JSX.Element {
  return (
    <div className={'flex flex-col justify-start'}>
      <h2
        className={
          'bg-gradient-to-r from-blue-500 to-sky-100 bg-clip-text text-title font-bold text-transparent'
        }
      >
        Experience
      </h2>
      <div className={'h-[0.1rem] w-full bg-blue-600 dark:bg-blue-200'} />
      <div className={'flex flex-col text-desc'}>
        {data?.map((company) => (
          <div
            className={
              'grid grid-cols-1 gap-[2.4rem] border-b border-dotted border-blue-200 py-[2.4rem] text-desc mo:grid-cols-3 mo:gap-[0.4rem]'
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
              <ul className={'mt-[0.4rem] flex flex-wrap items-center justify-start gap-[0.2rem]'}>
                {company.stack?.map((key, idx) => (
                  <li
                    key={`${key}_${idx}`}
                    className={`rounded-3xl bg-gray-200 px-[0.6rem] py-[0.2rem] text-[1rem] dark:bg-gray-500 dark:text-white`}
                  >
                    # {key}
                  </li>
                ))}
              </ul>
            </div>
            <div className={'col-span-1 flex flex-col gap-[2.4rem] mo:col-span-2'}>
              <div className={'flex flex-col items-start justify-start gap-[1.6rem]'}>
                <div
                  className={
                    'before:contents-[""] relative pl-[1rem] before:absolute before:left-0 before:top-0 before:h-full before:w-[0.3rem] before:bg-neutral-600 before:dark:bg-neutral-300'
                  }
                >
                  <p dangerouslySetInnerHTML={{ __html: company.description }}></p>
                </div>
                <div className={'pl-[0.8rem]'}>
                  <ul className={'text-desc font-light text-gray-500 dark:text-gray-400'}>
                    {company.summary?.map((item, idx) => (
                      <li
                        key={`${item}_${idx}`}
                        className={`relative pl-[clamp(0.8rem,2vw,1.6rem)]`}
                      >
                        <span className={'absolute left-0 top-0'}>-</span>
                        <span
                          className={
                            '[&>span]:rounded-2xl [&>span]:bg-blue-400 [&>span]:px-[0.6rem] [&>span]:text-white [&>span]:dark:bg-blue-600'
                          }
                          dangerouslySetInnerHTML={{ __html: item }}
                        />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div>
                <p className={'mb-[0.8rem] font-extrabold'}>
                  진행 프로젝트({company.project.length}개)
                </p>
                <AccordionRoot values={[]} rounded={true}>
                  {company.project?.map((item) => (
                    <AccordionItem value={item.id + ''} key={item.id}>
                      <AccordionTitle wrapperClass={'h-[clamp(3.4rem,5vw,4.8rem)]'} ellipsis>
                        <strong>{item.name}</strong>
                      </AccordionTitle>
                      <AccordionContent>
                        {item.summary && (
                          <>
                            <p className={'text-sub-desc font-medium'}>{item.summary}</p>
                            {/* 구분선 */}
                            <div
                              className={
                                'col-span-3 my-[1.4rem] h-[0.1rem] w-full border border-dotted border-gray-200 dark:border-gray-200'
                              }
                            />
                          </>
                        )}
                        {item.details.length > 0 && (
                          <>
                            <ul className={'font-light mo:text-sub-desc [&_strong]:font-bold'}>
                              {item.details?.map((detail, idx) => (
                                <li
                                  key={`${detail}_${idx}`}
                                  className={`relative pl-[clamp(0.8rem,2vw,1.6rem)]`}
                                >
                                  <span className={'absolute left-0 top-0'}>-</span>
                                  <span dangerouslySetInnerHTML={{ __html: detail }} />
                                </li>
                              ))}
                              <li className={`relative pl-[clamp(0.8rem,2vw,1.6rem)]`}>
                                <span className={'absolute left-0 top-0'}>-</span>
                                <span className={'flex items-start justify-start gap-[0.4rem]'}>
                                  <strong className={'flex-shrink-0'}>개발 기간 : </strong>
                                  <span>
                                    {item.period[0]} ~ {item.period[1]}
                                  </span>
                                </span>
                              </li>
                              <li className={`relative pl-[clamp(0.8rem,2vw,1.6rem)]`}>
                                <span className={'absolute left-0 top-0'}>-</span>
                                <span className={'flex items-start justify-start gap-[0.4rem]'}>
                                  <strong className={'flex-shrink-0'}>기술 스택 : </strong>
                                  <ul
                                    className={
                                      'mt-[0.2rem] inline-flex flex-wrap items-center justify-start gap-[0.2rem]'
                                    }
                                  >
                                    {item.skills?.map((skill, idx) => (
                                      <li
                                        key={`${skill}_${idx}`}
                                        className={`rounded-3xl bg-gray-200 px-[0.6rem] py-[0.2rem] text-[1rem] dark:bg-gray-500 dark:text-white`}
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
                                  'col-span-3 my-[1.4rem] h-[0.1rem] w-full border border-dotted border-gray-200 dark:border-gray-200'
                                }
                              />
                            )}
                            <ul className={'font-light mo:text-sub-desc'}>
                              {item.roles?.map((role, idx) => (
                                <li
                                  key={`${role}_${idx}`}
                                  className={`relative mt-[0.4rem] pl-[clamp(0.8rem,2vw,1.6rem)] [&_strong]:font-bold [&_strong]:dark:text-gray-200`}
                                >
                                  <span className={'absolute left-0 top-0'}>{idx + 1}.</span>
                                  {typeof role === 'string' ? (
                                    <div dangerouslySetInnerHTML={{ __html: role }} />
                                  ) : (
                                    <>
                                      <div dangerouslySetInnerHTML={{ __html: role[0] }} />
                                      {Array.isArray(role[1]) &&
                                        role[1]?.map((detail) => (
                                          <div
                                            key={detail}
                                            className={'relative pl-[clamp(0.8rem,2vw,1.6rem)]'}
                                          >
                                            <span className={'absolute left-0 top-0'}>-</span>
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
