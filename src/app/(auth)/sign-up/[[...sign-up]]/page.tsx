import { SignUp } from "@clerk/nextjs"
import { dark } from "@clerk/themes"
import { useCurrentTheme } from "@/hooks/use-current-theme"

export default function Page() {
  const currentTheme = useCurrentTheme()

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <SignUp
        appearance={{
          baseTheme: currentTheme === "dark" ? dark : undefined,
          elements: {
            cardBox: "border! shadow-none! rounded-lg!",
          },
        }}
      />
    </div>
  )
}
