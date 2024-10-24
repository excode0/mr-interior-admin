import Navbar from '@/components/Navbar';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import React from 'react';

const page = async () => {
  const session = await getServerSession(authOptions);
  console.log(session);
  if (!session) {
    return (
      <>
        <Navbar />
        <div>PLEASE LOGIN BRO</div>
      </>
    );
  }
  return (
    <>
      <Navbar />
      <div>WELCOME TO MY PARADISE : {session?.user.username}</div>
    </>
  );
};

export default page;
