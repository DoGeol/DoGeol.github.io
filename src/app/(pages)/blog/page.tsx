import type { Metadata } from 'next';
import Link from 'next/link';
import { getPosts } from '@/shared/lib/posts';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: '블로그',
    description: 'DoGeol의 기술 블로그',
  };
}

export default function Page() {
  const posts = getPosts();

  return (
    <section className="w-full max-w-4xl mx-auto py-12 md:py-20 px-4">
      <div className="space-y-4 mb-12">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">블로그</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">
          기술, 개발, 그리고 일상에 대한 생각을 기록합니다.
        </p>
      </div>

      <div className="space-y-10">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link href={`/blog/${post.slug}`}>
              <div className="flex flex-col space-y-2">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(post.date).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
                <h2 className="text-2xl font-bold tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{post.summary}</p>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  더 읽어보기 &rarr;
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
