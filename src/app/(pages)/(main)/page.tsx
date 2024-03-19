import React from 'react'
import { ABOUT_ME, CAREER, INFORMATION } from '@/app/(pages)/(main)/_constant/data'
import Information from '@/app/(pages)/(main)/_components/Information'
import AboutMe from '@/app/(pages)/(main)/_components/AboutMe'
import { AccordionTitle } from '@/components/element/Accordion/Title'
import { AccordionContent } from '@/components/element/Accordion/Content'
import { AccordionItem } from '@/components/element/Accordion/Item'
import { AccordionRoot } from '@/components/element/Accordion/Root'

export default function Home(): React.JSX.Element {
  return (
    <div
      className={
        'mx-auto flex min-h-[calc(100dvh_-_4rem)] min-w-[30rem] max-w-[120rem] flex-col text-[1.4rem]'
      }
    >
      <div className={'mt-[3.2rem] w-full p-[3.2rem] mo:mt-[6rem]'}>
        <Information data={INFORMATION} />
      </div>
      <div className={'w-full p-[3.2rem]'}>
        <AboutMe data={ABOUT_ME} />
      </div>
      {/* Skills */}

      {/* Experience*/}
      <div className={'w-full p-[3.2rem]'}>
        <div className={'flex flex-col justify-start'}>
          <h2
            className={
              'bg-gradient-to-r from-blue-500 to-sky-100 bg-clip-text text-title font-bold text-transparent'
            }
          >
            Experience
          </h2>
          <div className={'mb-[2.4rem] h-[0.1rem] w-full bg-blue-600 dark:bg-blue-200'} />
          <div className={'flex flex-col gap-[2.4rem] text-desc'}>
            {CAREER?.map((company) => (
              <>
                <div
                  className={
                    'grid grid-cols-1 gap-[2.4rem] text-desc mo:grid-cols-3 mo:gap-[0.4rem]'
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
                    <ul
                      className={
                        'mt-[0.4rem] flex flex-wrap items-center justify-start gap-[0.2rem]'
                      }
                    >
                      {company.stack?.map((key) => (
                        <li
                          key={key}
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
                          {company.summary?.map((item) => (
                            <li key={item} className={`relative pl-[clamp(0.8rem,2vw,1.6rem)]`}>
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
                                <p className={'font-medium'}>
                                  {item.summary}{' '}
                                  <span className={'text-[1rem]'}>
                                    ({item.period[0]} ~ {item.period[1]})
                                  </span>
                                </p>
                              )}
                              {item.skills.length > 0 && (
                                <>
                                  <ul
                                    className={
                                      'mt-[0.8rem] flex flex-wrap items-center justify-start gap-[0.2rem]'
                                    }
                                  >
                                    {item.skills?.map((skill) => (
                                      <li
                                        key={skill}
                                        className={`rounded-3xl bg-gray-200 px-[0.6rem] py-[0.2rem] text-[1rem] dark:bg-gray-500 dark:text-white [&>strong]:font-medium`}
                                      >
                                        # {skill}
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                              {/* 구분선 */}
                              <div
                                className={
                                  'col-span-3 my-[0.8rem] h-[0.1rem] w-full border border-dotted border-gray-200 dark:border-gray-200'
                                }
                              />
                              {item.details.length > 0 && (
                                <>
                                  <ul
                                    className={
                                      'mo:text-sub-desc font-light text-gray-500 dark:text-gray-400'
                                    }
                                  >
                                    {item.details?.map((detail) => (
                                      <li
                                        key={detail}
                                        className={`relative pl-[clamp(0.8rem,2vw,1.6rem)]`}
                                      >
                                        <span className={'absolute left-0 top-0'}>-</span>
                                        <span
                                          className={
                                            '[&>span]:rounded-2xl [&>span]:bg-blue-400 [&>span]:px-[0.6rem] [&>span]:text-white [&>span]:dark:bg-blue-600'
                                          }
                                          dangerouslySetInnerHTML={{ __html: detail }}
                                        />
                                      </li>
                                    ))}
                                  </ul>
                                </>
                              )}
                              {item.roles.length > 0 && (
                                <>
                                  {/* 구분선 */}
                                  <div
                                    className={
                                      'col-span-3 my-[0.8rem] h-[0.1rem] w-full border border-dotted border-gray-200 dark:border-gray-200'
                                    }
                                  />

                                  <ul
                                    className={
                                      'mo:text-sub-desc font-light text-gray-500 dark:text-gray-400'
                                    }
                                  >
                                    {item.roles?.map((role) => (
                                      <li
                                        key={role}
                                        className={`relative pl-[clamp(0.8rem,2vw,1.6rem)]`}
                                      >
                                        <span className={'absolute left-0 top-0'}>-</span>
                                        <span
                                          className={
                                            '[&>span]:rounded-2xl [&>span]:bg-blue-400 [&>span]:px-[0.6rem] [&>span]:text-white [&>span]:dark:bg-blue-600 [&>strong]:font-medium'
                                          }
                                          dangerouslySetInnerHTML={{ __html: role }}
                                        />
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
                <div
                  className={
                    'col-span-3 my-[0.8rem] h-[0.1rem] w-full border border-dotted border-blue-200 dark:border-blue-200'
                  }
                />
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
