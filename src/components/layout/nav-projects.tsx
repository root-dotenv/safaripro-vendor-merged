"use client";
import { MoreHorizontal, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

// Define a type for the dropdown actions
type ActionItem = {
  label: string;
  url: string;
  icon: React.ElementType;
};

export function NavProjects({
  projects,
  moreLinks,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
    actions?: ActionItem[];
  }[];
  moreLinks: ActionItem[];
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Reports Overview</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem
            className="text-[#14B2CF] text-[0.875rem] transition-all"
            key={item.name}
          >
            <SidebarMenuButton
              className="hover:bg-[#E6EFFF] my-[1px] text-[#476EFB] bg-[#E6EFFF] transition-all hover:text-[#476EFB]"
              asChild
            >
              <Link to={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>

            {item.actions && item.actions.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction showOnHover>
                    <MoreHorizontal />
                    <span className="sr-only ">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-48"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                >
                  {item.actions.map((action) => (
                    <DropdownMenuItem key={action.label} asChild>
                      <Link to={action.url}>
                        <action.icon className="mr-2 size-4 text-muted-foreground" />
                        <span>{action.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        ))}

        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton className="text-[#476EFB] cursor-pointer hover:bg-[#E6EFFF] transition-all hover:text-[#0D1421] text-[13px]">
                <MoreHorizontal />
                <span>More</span>
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-48"
              side="bottom"
              align="start"
              sideOffset={6}
            >
              {moreLinks.map((link) => (
                <DropdownMenuItem key={link.label} asChild>
                  <Link to={link.url}>
                    <link.icon className="mr-2 size-4 text-muted-foreground" />
                    <span>{link.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
