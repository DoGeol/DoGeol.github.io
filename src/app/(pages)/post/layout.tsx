
import type { PropsWithChildren } from 'react';
import { PostLayout } from '@/app/(pages)/post/_components/post-layout';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <main className="h-full w-full">
      <PostLayout>{children}</PostLayout>
    </main>
  );
};

export default Layout;
