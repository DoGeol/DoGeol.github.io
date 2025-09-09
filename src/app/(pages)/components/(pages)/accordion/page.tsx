'use client'
import React, { useState } from 'react'
import { AccordionItem } from '@/features/ui/Accordion/Item'
import { AccordionTitle } from '@/features/ui/Accordion/Title'
import { AccordionContent } from '@/features/ui/Accordion/Content'
import { AccordionRoot } from '@/features/ui/Accordion/Root'

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [accordion, setAccordion] = useState<string[]>([])
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [accordion2, setAccordion2] = useState<string[]>([])
  return (
    <>
      <p className={'mb-[4.0rem] text-sub-title'}>아코디언 컴포넌트</p>
      <div className={'flex flex-col gap-[2.0rem]'}>
        <div>
          <h3 className={'mb-[0.8rem] text-[2.0rem] font-bold'}>Multiple</h3>
          <div
            className={
              'flex flex-col gap-[0.8rem] rounded-xl border border-solid border-gray-300 p-[1.8rem]'
            }
          >
            <AccordionRoot
              multiple={true}
              values={accordion}
              onChange={setAccordion}
              rounded={false}
            >
              <AccordionItem value={'1'}>
                <AccordionTitle>제목</AccordionTitle>
                <AccordionContent>
                  {Array(1)
                    .fill(
                      `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur
                  cumque, doloribus earum et libero placeat quae quia quis ratione reiciendis sequi
                  sit, tenetur veritatis, vitae. Adipisci animi itaque sequi!`,
                    )
                    .join(' ')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value={'2'}>
                <AccordionTitle>테스트 제목 입니당</AccordionTitle>
                <AccordionContent>
                  {Array(9)
                    .fill(
                      `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur
                  cumque, doloribus earum et libero placeat quae quia quis ratione reiciendis sequi
                  sit, tenetur veritatis, vitae. Adipisci animi itaque sequi!`,
                    )
                    .join(' ')}
                </AccordionContent>
              </AccordionItem>
            </AccordionRoot>
          </div>
        </div>
        <div>
          <h3 className={'mb-[0.8rem] text-[2.0rem] font-bold'}>Rounded</h3>
          <div
            className={
              'flex flex-col gap-[0.8rem] rounded-xl border border-solid border-gray-300 p-[1.8rem]'
            }
          >
            <AccordionRoot
              multiple={false}
              values={accordion2}
              onChange={setAccordion2}
              rounded={true}
            >
              <AccordionItem value={'1'}>
                <AccordionTitle>제목</AccordionTitle>
                <AccordionContent>
                  {Array(1)
                    .fill(
                      `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur
                  cumque, doloribus earum et libero placeat quae quia quis ratione reiciendis sequi
                  sit, tenetur veritatis, vitae. Adipisci animi itaque sequi!`,
                    )
                    .join(' ')}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value={'2'}>
                <AccordionTitle>테스트 제목 입니당</AccordionTitle>
                <AccordionContent>
                  {Array(100)
                    .fill(
                      `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur
                  cumque, doloribus earum et libero placeat quae quia quis ratione reiciendis sequi
                  sit, tenetur veritatis, vitae. Adipisci animi itaque sequi!`,
                    )
                    .join(' ')}
                </AccordionContent>
              </AccordionItem>
            </AccordionRoot>
          </div>
        </div>
      </div>
    </>
  )
}
