"use client";
import { PricingTable } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";
import Image from "next/image";

export default function Page() {
  const currentTheme = useCurrentTheme();
  return (
    <div className="flex flex-col max-w-3xl mx-auto w-full">
      <section className="space-y-6 py-16 md:py-24 lg:py-32 xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src="/logo.svg"
            alt="Vibe"
            width={50}
            height={50}
            className="hidden md:block"
          />
          <h1 className="text-xl md:text-3xl font-bold text-center">Pricing</h1>
          <p className="text-muted-foreground text-center text-sm md:text-base">
            Choose the plan that fits your needs.
          </p>
        </div>
        <PricingTable
          appearance={{
            baseTheme: currentTheme === "dark" ? dark : undefined,
            elements: {
              pricingTableCard: "border shadow-none rounded-2xl",
            },
          }}
        />
      </section>
    </div>
  );
}