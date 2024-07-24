import Link from "next/link"
import APIForm from "./api-form"
import { Button } from "./ui/button"

export function Hero() {
  return (
    <section className="flex items-center justify-center h-screen w-full">
      <div className="flex flex-col items-center justify-center gap-3 px-4 md:px-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tighter text-left">
            We are tired of you fake gurus
          </h1>
          <p className=" text-left text-muted-foreground">
            Prove your income claim using gurucatcher and let&apos;s see if you real or fake
          </p>
        </div>
        <div className="flex w-full items-center">
          <APIForm />
        </div>
      </div>
    </section>
  )
}