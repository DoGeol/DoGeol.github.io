import type { NextPage } from 'next'

const Page: NextPage = () => {
  return (
    <section className="h-full w-full">
      <div className="mx-auto flex flex-col h-full w-full items-center justify-center">
        포트폴리오
        {Array(100)
          .fill(null)
          .map((_, idx) => (
            <p key={idx}>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Deleniti explicabo inventore
              officia totam ut. Assumenda dicta dolorem, error fugit ipsa, nemo neque non nulla,
              officiis sapiente totam voluptatem voluptatibus. Quod.
            </p>
          ))}
      </div>
    </section>
  )
}

export default Page
