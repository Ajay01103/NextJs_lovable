"use client"

import { PricingTable } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import Image from "next/image"
import { useCurrentTheme } from "@/hooks/use-current-theme"

const Pricing = () => {
  const currentTheme = useCurrentTheme()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col">
      <section className="space-y-6 pt-[16vh] 2xl:pt-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="vibe"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-center font-bold text-xl md:text-3xl">Pricing</h1>
        <p className="text-sm md:text-base">
          Choose the plan that fits your need
        </p>
        <PricingTable
          appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
            elements: {
              pricingTableCard: "border! shadow-none! rounded-lg!",
            },
          }}
        />
      </section>
    </div>
  )
}

export default Pricing
