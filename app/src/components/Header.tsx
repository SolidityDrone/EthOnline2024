import React from 'react'
import { LinkComponent } from './LinkComponent'
import { Connect } from './Connect'
import Leaderboard from "@/components/Leaderboard";
import History from "@/components/History";

import Image from 'next/image'

export function Header() {
  return (
    <header className="fixed top-0 left-0 h-[55px] w-full z-10 bg-head flex justify-between items-center p-4">
      <h1>Kartik Adventures</h1>
      
      {/* Centered buttons */}
      <div className="flex-1 flex justify-center">
        <div className="flex gap-5">
          <Leaderboard />
          <History />
        </div>
      </div>
      
      <div className="flex gap-2 items-center">

        <Connect />
      </div>
    </header>
  );
}
