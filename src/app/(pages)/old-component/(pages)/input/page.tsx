'use client'
import Input from '@/shared/ui/Input'
import React, { useState } from 'react'

export default function page() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [val, setVal] = useState<any>('1231232')
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [accordion, setAccordion] = useState<string[]>(['2'])
  return (
    <>
      <p className={'text-sub-title mb-16'}>인풋 컴포넌트</p>
      <div className={'flex flex-col gap-8'}>
        <div>
          <h3 className={'mb-3 text-3xl font-bold'}>SIZE</h3>
          <div
            className={
              'flex flex-col gap-3 rounded-xl border border-solid border-gray-300 p-7'
            }
          >
            <p className={'font-medium capitalize'}>small : {val}</p>
            <Input
              size={'small'}
              value={val}
              onChange={(e, val) => {
                setVal(e.target.value)
              }}
              onEnter={(e, val) => {
                console.log('enter : ', e, val)
              }}
            />
            <p className={'font-medium capitalize'}>medium</p>
            <Input size={'medium'} placeholder={'123'} readOnly />
            <p className={'font-medium capitalize'}>large</p>
            <Input size={'large'} />
          </div>
        </div>
        <div>
          <h3 className={'mb-3 text-3xl font-bold'}>TYPE</h3>
          <div
            className={
              'flex flex-col gap-3 rounded-xl border border-solid border-gray-300 p-7'
            }
          >
            <p className={'font-medium capitalize'}>text</p>
            <Input type={'text'} />
            <p className={'font-medium capitalize'}>number</p>
            <Input type={'number'} />
            <p className={'font-medium capitalize'}>tel</p>
            <Input type={'tel'} />
            <p className={'font-medium capitalize'}>password</p>
            <Input type={'password'} />
          </div>
        </div>
      </div>
    </>
  )
}