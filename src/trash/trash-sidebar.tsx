// import { AppSidebar } from "@/components/layout/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Outlet } from "react-router-dom";

// export default function DashboardLayout() {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset>
//         <header className="flex h-16 shrink-0 items-center gap-2">
//           <div className="flex items-center gap-2 px-4">
//             <SidebarTrigger className="-ml-1" />
//             <Separator
//               orientation="vertical"
//               className="mr-2 data-[orientation=vertical]:h-4"
//             />
//             <Breadcrumb>
//               <BreadcrumbList>
//                 <BreadcrumbItem className="hidden md:block">
//                   <BreadcrumbLink href="/">Hotel Management</BreadcrumbLink>
//                 </BreadcrumbItem>
//                 <BreadcrumbSeparator className="hidden md:block" />
//                 <BreadcrumbItem>
//                   <BreadcrumbPage>Dashboard</BreadcrumbPage>
//                 </BreadcrumbItem>
//               </BreadcrumbList>
//             </Breadcrumb>
//           </div>
//         </header>
//         <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
//           <Outlet />
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// // - - - - Added a Top Navigation bar implementation
// import { AppSidebar } from "@/components/layout/app-sidebar";
// import {
//   Breadcrumb,
//   BreadcrumbItem,
//   BreadcrumbLink,
//   BreadcrumbList,
//   BreadcrumbPage,
//   BreadcrumbSeparator,
// } from "@/components/ui/breadcrumb";
// import { Separator } from "@/components/ui/separator";
// import {
//   SidebarInset,
//   SidebarProvider,
//   SidebarTrigger,
// } from "@/components/ui/sidebar";
// import { Outlet } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Bell, Mail, SunMoon, Search, Zap } from "lucide-react";

// export default function DashboardLayout() {
//   return (
//     <SidebarProvider>
//       <AppSidebar />
//       <SidebarInset className="flex flex-col h-screen">
//         {/* Top Navigation Bar */}
//         <header className="sticky bg-background rounded-t-2xl top-0 z-10 backdrop-blur border-b">
//           <div className="flex h-16 items-center justify-between px-4">
//             {/* Left side - Breadcrumbs and sidebar toggle */}
//             <div className="flex items-center gap-2">
//               <SidebarTrigger className="-ml-1" />
//               <Separator
//                 orientation="vertical"
//                 className="mr-2 data-[orientation=vertical]:h-4"
//               />
//               <Breadcrumb>
//                 <BreadcrumbList>
//                   <BreadcrumbItem className="hidden md:block">
//                     <BreadcrumbLink href="/">Hotel Management</BreadcrumbLink>
//                   </BreadcrumbItem>
//                   <BreadcrumbSeparator className="hidden md:block" />
//                   <BreadcrumbItem>
//                     <BreadcrumbPage>Dashboard</BreadcrumbPage>
//                   </BreadcrumbItem>
//                 </BreadcrumbList>
//               </Breadcrumb>
//             </div>

//             {/* Right side - Navigation items */}
//             <div className="flex items-center justify-between gap-4">
//               {/* Search-input */}
//               <div className="relative w-64">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                 <Input placeholder="Search..." className="pl-9" />
//               </div>

//               {/* Quick Actions,Theme Toggle, Messages, Notifications, User Profile (placeholder)   */}
//               <div>
//                 <Button variant="ghost" size="icon">
//                   <Zap className="h-5 w-5" />
//                 </Button>

//                 <Button variant="ghost" size="icon">
//                   <SunMoon className="h-5 w-5" />
//                 </Button>

//                 <Button variant="ghost" size="icon">
//                   <Mail className="h-5 w-5" />
//                   <span className="sr-only">Messages</span>
//                 </Button>

//                 <Button variant="ghost" size="icon">
//                   <Bell className="h-5 w-5" />
//                   <span className="sr-only">Notifications</span>
//                 </Button>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <div className="flex-1 overflow-auto">
//           <div className="flex flex-col gap-4 p-4 pt-0">
//             <Outlet />
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }
