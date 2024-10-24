'use client';
import React from 'react';
import { Button } from './button';
import { signOut } from 'next-auth/react';

const UserNavigation = () => {
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

export default UserNavigation;
