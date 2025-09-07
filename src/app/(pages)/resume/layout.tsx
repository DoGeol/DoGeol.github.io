import React from 'react';

type TProps = {
  children: React.ReactNode;
};

export default function ResumeLayout({ children }: TProps) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {children}
    </main>
  );
}
