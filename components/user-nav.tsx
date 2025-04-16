"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { logout } from "@/lib/auth"
import { useAppSelector } from "@/lib/store/hooks"
import { useAuth0 } from "@auth0/auth0-react"
import { Loader2 } from "lucide-react"

export function UserNav() {
  const { user} = useAppSelector((state) => state.userStore)
  const { logout: auth0Logout } = useAuth0();
  // Mock user data
  const mockUser = {
    name: "Admin User",
    email: "admin@example.com",
    picture: "/placeholder.svg?height=32&width=32",
  }
  // console.log("user", user)

  const handleLogout = () => {

    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
    logout()
  }
  if(user){
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user?.avatar?.url} alt={user?.name} />
              <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }
  else {
    return (
      <Button variant="ghost" className="relative h-8 w-8 rounded-full">
        <Loader2 className="h-4 w-4 animate-spin" />
      </Button>
    )
  }
}
