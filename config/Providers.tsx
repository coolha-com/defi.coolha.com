'use client';

import { Theme } from './Theme';
import { Wagmi } from './Wagmi';



export function Providers({ children }: any) {
  return (
    <>
      <Theme>
        <Wagmi>
          {children}
        </Wagmi>
      </Theme>
    </>
  );
}