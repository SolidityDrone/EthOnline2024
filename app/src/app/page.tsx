"use client"
import Image from "next/image";
import {UnityPlayerApp} from "../../public/unity-player"
import { Header } from '@/components/Header'


export default function App() {
  return (
    <main className="flex flex-col items-center justify-between ">
      <div className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
      <Header />
        <UnityPlayerApp/>
      </div>
    </main>
  );
}
