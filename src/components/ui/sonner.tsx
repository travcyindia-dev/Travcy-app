"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      icons={{
        success: <CircleCheckIcon className="size-4" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      // position="top-center"
      style={
        {
          "--success-bg": "var(--green-500)",
          "--success-text": "white",
          "--success-border": "var(--green-600)",

          "--error-bg": "var(--red-500)",
          "--error-text": "white",
          "--error-border": "var(--red-600)",

          "--warning-bg": "var(--yellow-500)",
          "--warning-text": "black",
          "--warning-border": "var(--yellow-600)",

          "--info-bg": "var(--blue-500)",
          "--info-text": "white",
          "--info-border": "var(--blue-600)",

          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",

          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
           {...props}
    />
  )
}

export { Toaster }
