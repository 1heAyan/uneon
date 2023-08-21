import * as React from "react"
import { Moon, Sun, User } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "./mode-toggle"
import { UserButton } from "@clerk/nextjs"
import { FreeCounter } from "./free-counter"

export const SettingsCenter = () => {
  const apiLimitCount = 0; // Replace with your actual value
  const isPro = false; // Replace with your actual value
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button size="icon" >
          <User/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="custom-dropdown border-dotted  border-2  " > {/* Apply a custom class */}
        <DropdownMenuItem className="p-3" style={{borderBottom:"1px solid black", borderRadius:"0"}}>
          <UserButton afterSignOutUrl="/"  />
        </DropdownMenuItem>
        <DropdownMenuItem className="p-2">
          <ModeToggle/>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
