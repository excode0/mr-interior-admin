import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/toaster';
import { FC, ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className='bg-slate-200 p-10 rounded-md'>{children}</div>

      <Toaster />
    </>
  );
};

export default AuthLayout;
