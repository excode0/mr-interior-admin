'use client';

import { signOut } from 'next-auth/react';
import { Button } from './button';

const UserAccountNav = () => {
  return (
    <Button
      onClick={() =>
        signOut({
          redirect: true,
          callbackUrl: `${window.location.origin}/sign-in`,
        })
      }
      variant={'destructive'}
    >
      SIGN OUT
    </Button>
  );
};

export default UserAccountNav;
