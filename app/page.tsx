import Navbar from '@/components/Navbar';
import User from '@/components/User';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <>
      <Navbar />
      <h1 className='text-4xl'>Home</h1>
      <h2>CLIENT SESSION</h2>
      <User />
      <h2>SERVER SESSION</h2>
      {JSON.stringify(session)}
    </>
  );
}
