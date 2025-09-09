import type { PropsWithChildren } from 'react';

const Layout = ({ children }: PropsWithChildren) => {
  return <main className="h-full min-h-[100dvh] w-full">{children}</main>;
};

export default Layout;