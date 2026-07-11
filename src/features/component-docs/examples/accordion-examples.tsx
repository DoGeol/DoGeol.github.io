'use client'

import {
  AccordionContent,
  AccordionItem,
  AccordionRoot,
  AccordionTitle,
} from '@/shared/ui/Accordion'

export function AccordionBasicExample() {
  return (
    <div className="w-full max-w-xl">
      <AccordionRoot values={['intro']} rounded>
        <AccordionItem value="intro">
          <AccordionTitle>이 컴포넌트는 무엇인가요?</AccordionTitle>
          <AccordionContent>여러 콘텐츠 영역을 펼치거나 접는 컴포넌트입니다.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="usage">
          <AccordionTitle>여러 항목을 열 수 있나요?</AccordionTitle>
          <AccordionContent>
            기본값은 multiple이며 동시에 여러 항목을 열 수 있습니다.
          </AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    </div>
  )
}

export function AccordionSingleExample() {
  return (
    <div className="w-full max-w-xl">
      <AccordionRoot values={[]} multiple={false}>
        <AccordionItem value="one">
          <AccordionTitle>한 번에 하나만 열기</AccordionTitle>
          <AccordionContent>multiple을 false로 지정합니다.</AccordionContent>
        </AccordionItem>
      </AccordionRoot>
    </div>
  )
}
