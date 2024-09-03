"use client"
import Image from "next/image";
import {UnityPlayerApp} from "../../public/unity-player"


export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between ">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <UnityPlayerApp/>

      </div>
    </main>
  );
}
