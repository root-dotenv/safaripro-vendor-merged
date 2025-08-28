// src/components/layout/nav-user.tsx
"use client";
import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store"; // Import the auth store

// --- UI Components ---
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// --- Type Definition for live user data ---
interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

// --- Component Definition ---
export function NavUser({
  userProfile,
  isLoading,
}: {
  userProfile?: UserProfile;
  isLoading: boolean;
}) {
  const { isMobile } = useSidebar();
  const { logout } = useAuthStore(); // Get the logout function from the store

  const fallbackInitial = userProfile?.name
    ? userProfile.name.charAt(0).toUpperCase()
    : "U";

  const displayName = isLoading ? "Loading..." : userProfile?.name || "User";
  const displayEmail = isLoading ? "..." : userProfile?.email || "";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground bg-[#FFF] shadow border border-[#DADCE0] cursor-pointer"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                {userProfile?.avatar && (
                  <AvatarImage src={userProfile.avatar} alt={displayName} />
                )}
                <AvatarFallback className="rounded-lg bg-[#476EFB] text-[#FFF]">
                  {fallbackInitial}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{displayName}</span>
                <span className="truncate text-xs">{displayEmail}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {userProfile?.avatar && (
                    <AvatarImage src={userProfile.avatar} alt={displayName} />
                  )}
                  <AvatarFallback className="rounded-lg bg-[#476EFB] text-[#FFF]">
                    {fallbackInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{displayName}</span>
                  <span className="truncate text-xs">{displayEmail}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to={"/"}>
                <DropdownMenuItem>
                  <Sparkles className="mr-2 h-4 w-4" />
                  SafariPro Services
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to={"/"}>
                <DropdownMenuItem>
                  <BadgeCheck className="mr-2 h-4 w-4" />
                  My Account
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem>
                <CreditCard className="mr-2 h-4 w-4" />
                Billings & Payments
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {/* The onClick handler calls the logout function from the store */}
            <DropdownMenuItem onClick={logout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
