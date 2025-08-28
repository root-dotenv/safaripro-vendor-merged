"use client";
import { ChevronRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon: React.ElementType;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const location = useLocation();

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const hasActiveChild =
            item.items?.some((subItem) =>
              location.pathname.startsWith(subItem.url)
            ) ?? false;

          // Render a collapsible trigger if the item has sub-items
          if (item.items && item.items.length > 0) {
            // Check if the item should be open by default
            const isDefaultOpen =
              hasActiveChild ||
              item.title === "Bookings" ||
              item.title === "Rooms";

            return (
              <Collapsible key={item.title} asChild defaultOpen={isDefaultOpen}>
                <SidebarMenuItem className="text-[#476EFB]">
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      variant="ghost"
                      className="group w-full justify-between"
                      tooltip={item.title}
                    >
                      <div className="flex items-center gap-2 text-[#476EFB]">
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </div>
                      <ChevronRight className="size-4 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // Otherwise, render a simple link
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <Link to={item.url}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
