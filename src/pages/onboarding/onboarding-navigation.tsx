// // src/pages/onboarding/onboarding-navigation.tsx
// import { Link } from "react-router-dom";
// import { useAuthStore } from "@/store/auth.store";
// import { TbLogout, TbUser, TbFileText, TbShieldCheck } from "react-icons/tb";
// import safari_pro_logo_white from "../../../public/images/Safari_Pro_Logo.png";
// import { IoIosHelpCircleOutline } from "react-icons/io";

// // --- UI Components from Shadcn ---
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// const Logo = () => (
//   <Link to="/" className="flex items-center">
//     <div className="w-[140px]">
//       <img alt="SafariPro Logo" src={safari_pro_logo_white} />
//     </div>
//   </Link>
// );

// export function OnboardingNavigation() {
//   const { user, logout } = useAuthStore();

//   const displayName = user?.full_name || user?.sub || "SafariPro User";
//   const displayEmail = user?.sub || "";
//   const fallbackInitial = displayName
//     ? displayName.charAt(0).toUpperCase()
//     : "S";

//   return (
//     <header className="bg-gradient-to-tr from-[#196BCA] to-[#196BCA] sticky top-0 z-50 h-[76px] flex items-center">
//       <nav className="container w-[1350px] max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-4 lg:px-4">
//         <Logo />
//         <div className="flex items-center gap-4">
//           <button className="text-white font-medium inter cursor-pointer hover:opacity-100 flex items-center gap-x-2">
//             <IoIosHelpCircleOutline size={20} />
//             Help
//           </button>

//           {/* --- MODIFIED: Replaced manual logic with DropdownMenu --- */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <button className="relative rounded-full text-white font-medium text-[1rem] bg-gradient-to-t from-[#1A60B5] to-[#2E86F8] border-[2px] border-[#73adf5] px-2 py-2 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.25)]">
//                 <Avatar className="h-6 w-6 cursor-pointer">
//                   <AvatarFallback className="bg-transparent text-white text-[1.25rem] font-bold">
//                     {fallbackInitial}
//                   </AvatarFallback>
//                 </Avatar>{" "}
//               </button>
//             </DropdownMenuTrigger>
//             <span className="block inter text-[#FFF] font-semibold text-[1rem]">
//               Florence Mushi
//             </span>
//             <DropdownMenuContent className="w-64" align="end" forceMount>
//               <DropdownMenuLabel className="font-normal">
//                 <div className="flex flex-col space-y-1">
//                   <p className="font-semibold text-sm text-gray-800 truncate">
//                     {displayName}
//                   </p>
//                   <p className="text-xs text-gray-500 truncate">
//                     {displayEmail}
//                   </p>
//                 </div>
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               <Link to="/user-account">
//                 <DropdownMenuItem className="cursor-pointer">
//                   <TbUser className="mr-2 h-4 w-4" />
//                   <span>View Your Profile</span>
//                 </DropdownMenuItem>
//               </Link>
//               <DropdownMenuSeparator />
//               <Link to="/terms">
//                 <DropdownMenuItem className="cursor-pointer">
//                   <TbFileText className="mr-2 h-4 w-4" />
//                   <span>Terms & Conditions</span>
//                 </DropdownMenuItem>
//               </Link>
//               <Link to="/privacy">
//                 <DropdownMenuItem className="cursor-pointer">
//                   <TbShieldCheck className="mr-2 h-4 w-4" />
//                   <span>Privacy Policy</span>
//                 </DropdownMenuItem>
//               </Link>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => logout()}
//                 className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
//               >
//                 <TbLogout className="mr-2 h-4 w-4" />
//                 <span>Logout</span>
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </nav>
//     </header>
//   );
// }

// src/pages/onboarding/onboarding-navigation.tsx
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import { TbLogout, TbUser, TbFileText, TbShieldCheck } from "react-icons/tb";
import safari_pro_logo_white from "../../../public/images/Safari_Pro_Logo.png";
import { IoIosHelpCircleOutline } from "react-icons/io";

// --- UI Components from Shadcn ---
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Logo = () => (
  <Link to="/" className="flex items-center">
    <div className="w-[140px]">
      <img alt="SafariPro Logo" src={safari_pro_logo_white} />
    </div>
  </Link>
);

export function OnboardingNavigation() {
  // --- MODIFIED: Get userProfile from the store ---
  const { userProfile, logout } = useAuthStore();

  // --- MODIFIED: Use userProfile for display data with fallbacks ---
  const displayName = userProfile?.full_name || "User";
  const displayEmail = userProfile?.email || "";
  const fallbackInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : "S";

  return (
    <header className="bg-gradient-to-tr from-[#196BCA] to-[#196BCA] sticky top-0 z-50 h-[76px] flex items-center">
      <nav className="container w-[1350px] max-w-[1400px] mx-auto flex items-center justify-between px-4 sm:px-4 lg:px-4">
        <Logo />
        <div className="flex items-center gap-4">
          <button className="text-white font-medium inter cursor-pointer hover:opacity-100 flex items-center gap-x-2">
            <IoIosHelpCircleOutline size={20} />
            Help
          </button>

          <DropdownMenu>
            <div className="flex items-center gap-3">
              <DropdownMenuTrigger asChild>
                <button className="relative rounded-full text-white font-medium text-[1rem] bg-gradient-to-t from-[#1A60B5] to-[#2E86F8] border-[2px] border-[#73adf5] px-2 py-2 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.25)]">
                  <Avatar className="h-6 w-6 cursor-pointer">
                    <AvatarFallback className="bg-transparent text-white text-[1.25rem] font-bold">
                      {fallbackInitial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              {/* --- MODIFIED: Dynamically display the user's full name --- */}
              <span className="block inter text-[#FFF] font-semibold text-[1rem]">
                {displayName}
              </span>
            </div>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-semibold text-sm text-gray-800 truncate">
                    {displayName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {displayEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Link to="/user-account">
                <DropdownMenuItem className="cursor-pointer">
                  <TbUser className="mr-2 h-4 w-4" />
                  <span>View Your Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link to="/terms">
                <DropdownMenuItem className="cursor-pointer">
                  <TbFileText className="mr-2 h-4 w-4" />
                  <span>Terms & Conditions</span>
                </DropdownMenuItem>
              </Link>
              <Link to="/privacy">
                <DropdownMenuItem className="cursor-pointer">
                  <TbShieldCheck className="mr-2 h-4 w-4" />
                  <span>Privacy Policy</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => logout()}
                className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <TbLogout className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
    </header>
  );
}
