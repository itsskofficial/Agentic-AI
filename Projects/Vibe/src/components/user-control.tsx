"use client";
import { UserButton } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useCurrentTheme } from "@/hooks/use-current-theme";

interface Props {
  showName?: boolean;
}

export function UserControl({ showName }: Props) {
  const currentTheme = useCurrentTheme();
  return (
    <UserButton
      showName={showName}
      appearance={{
        baseTheme: currentTheme === "dark" ? dark : undefined,
        elements: {
          userButtonBox: "rounded-md!",
          userButtonAvatarBox: "rounded-md size-8",
          userButtonTrigger: "rounded-md",
        },
      }}
    />
  );
}