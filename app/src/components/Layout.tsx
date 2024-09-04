'use client'
import React, { PropsWithChildren } from 'react'

export function Layout(props: PropsWithChildren) {
  return (
   
    <div className='flex flex-col bg-tv w-full min-h-screen'>
  
 

 
   
      <main className='flex-grow pt-10 pb-4 w-full'>{props.children}</main>
   
    </div>
  )
}
