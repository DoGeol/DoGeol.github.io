export default function Home() {
  return (
    <div
      className={
        'flex min-h-[calc(100dvh_-_3rem)] flex-col text-[1.4rem] text-gray-700 dark:bg-neutral-900 dark:text-gray-300'
      }
    >
      <div className={'mt-[3.2rem] p-[3.2rem] mo:mt-[6rem]'}>
        <div className={'flex justify-center gap-[2.0rem]'}>
          <div className={'h-[10rem] w-[10rem] shrink-0 transition-all mo:h-[16rem] mo:w-[16rem]'}>
            <img
              className={'overflow-hidden rounded-full border border-solid object-cover'}
              src={'/profile/pdg.png'}
              alt={'pdg'}
            />
          </div>
          <div className={'p-[0.8rem] mo:p-[1.6rem]'}>
            <h1 className={'text-sample-title break-keep leading-[1.15]'}>
              안녕하세요.
              <br />
              프론트엔드 개발자 <strong className={'text-sky-600'}>편도걸</strong>입니다.
            </h1>
            <ul
              className={
                'mt-[1.2rem] flex items-center justify-start gap-[0.8rem] capitalize text-neutral-400 transition-all dark:text-neutral-400'
              }
            >
              <li className={'cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300'}>
                email
              </li>
              <li className={'cursor-pointer hover:text-neutral-500 dark:hover:text-neutral-300'}>
                github
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
