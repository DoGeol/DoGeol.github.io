'use client'

import dynamic from 'next/dynamic'

const ImageEditor = dynamic(() => import('./ImageEditor'), {
  ssr: false,
})

export default function PageClient() {
  return (
    <main
      className={
        'flex h-screen w-screen flex-col items-center justify-center overflow-auto bg-gray-100 px-[20px]'
      }
    >
      <h1 className="mb-[2.0rem] shrink-0 bg-linear-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-title font-semibold text-transparent">
        Thumbnail Generator
      </h1>

      {/* 컨텐츠 영역 */}
      <div
        className={
          'w-full rounded-2xl bg-white text-center text-sub-title shadow-xl mo:max-w-[80%]'
        }
      >
        <div className={'space-y-[2.0rem] p-[2.0rem]'}>
          <ImageEditor />
        </div>
      </div>
    </main>
  )
}
