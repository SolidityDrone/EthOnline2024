import React from 'react'
import { LinkComponent } from './LinkComponent'
import { Connect } from './Connect'

import Image from 'next/image'

export function Header() {
  return (
    <header className='fixed top-0 left-0  h-[55px] w-full z-10 bg-head flex justify-between items-center p-4'>
      <div className='flex w-[56%] gap-5'>
   
      </div>
      <div className='flex gap-2 items-center'>
        <Connect />

      </div>
    </header>
  )
}
