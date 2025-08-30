// // src/pages/onboarding/onboarding-navigation.tsx
// import { useState, type ReactNode } from "react";
// import { Link } from "react-router-dom";
// import { motion, AnimatePresence } from "framer-motion";
// import { useAuthStore } from "@/store/auth.store";
// import {
//   TbLogout,
//   TbUser,
//   TbFileText,
//   TbShieldCheck,
//   TbInfoCircle,
// } from "react-icons/tb";
// import safari_pro_logo from "../../../public/images/Safari_Pro_Blue_Logo.png";

// const Logo = () => (
//   <Link to="/" className="flex items-center">
//     <img
//       alt="SafariPro Logo"
//       src={safari_pro_logo}
//       className="h-8 md:h-10 w-auto"
//     />
//   </Link>
// );

// const ActionMenuItem = ({
//   icon,
//   text,
//   to,
//   onClick,
// }: {
//   icon: ReactNode;
//   text: string;
//   to?: string;
//   onClick?: () => void;
// }) => {
//   const content = (
//     <div className="flex items-center gap-3 p-2.5 rounded-md hover:bg-gray-100 transition-colors w-full text-left">
//       <span className="text-gray-600">{icon}</span>
//       <span className="text-gray-800 font-medium text-sm">{text}</span>
//     </div>
//   );

//   return to ? (
//     <Link to={to} className="w-full">
//       {content}
//     </Link>
//   ) : (
//     <button onClick={onClick} className="w-full">
//       {content}
//     </button>
//   );
// };

// export function OnboardingNavigation() {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const { logout } = useAuthStore();

//   return (
//     <header className="bg-[#0081FB] border-b border-gray-200 sticky top-0 z-50 h-[70px] flex items-center">
//       <nav className="container max-w-7xl mx-auto flex items-center justify-between p-4">
//         <Logo />
//         <div className="flex items-center gap-4">
//           <button className="text-gray-500 hover:text-blue-600">
//             <TbInfoCircle size={24} />
//           </button>
//           <div className="relative">
//             <button
//               onClick={() => setIsDropdownOpen((prev) => !prev)}
//               className="p-2 rounded-full hover:bg-gray-100"
//             >
//               <TbUser size={24} className="text-gray-700" />
//             </button>
//             <AnimatePresence>
//               {isDropdownOpen && (
//                 <motion.div
//                   initial={{ opacity: 0, y: 10 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   exit={{ opacity: 0, y: 10 }}
//                   transition={{ duration: 0.2 }}
//                   className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 p-2"
//                 >
//                   <div className="space-y-1">
//                     <ActionMenuItem
//                       icon={<TbUser size={18} />}
//                       text="View Your Profile"
//                       to="/user-account"
//                     />
//                     <hr className="my-1" />
//                     <ActionMenuItem
//                       icon={<TbFileText size={18} />}
//                       text="Terms & Conditions"
//                       to="/terms" // Example link
//                     />
//                     <ActionMenuItem
//                       icon={<TbShieldCheck size={18} />}
//                       text="Privacy Policy"
//                       to="/privacy" // Example link
//                     />
//                     <hr className="my-1" />
//                     <ActionMenuItem
//                       icon={<TbLogout size={18} color="#D32F2F" />}
//                       text="Logout"
//                       onClick={() => logout()}
//                     />
//                   </div>
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </div>
//         </div>
//       </nav>
//     </header>
//   );
// }

// src/pages/onboarding/onboarding-navigation.tsx
// src/pages/onboarding/onboarding-navigation.tsx
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/auth.store";
import {
  TbLogout,
  TbUser,
  TbFileText,
  TbShieldCheck,
  TbInfoCircle,
} from "react-icons/tb";
import safari_pro_logo_white from "../../../public/images/Safari_Pro_Logo.png";

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
    <img
      alt="SafariPro Logo"
      src={safari_pro_logo_white}
      className="h-8 md:h-10 w-auto"
    />
  </Link>
);

export function OnboardingNavigation() {
  const { user, logout } = useAuthStore();

  const displayName = user?.full_name || user?.sub || "SafariPro User";
  const displayEmail = user?.sub || "";
  const fallbackInitial = displayName
    ? displayName.charAt(0).toUpperCase()
    : "S";

  return (
    <header className="bg-[#0081FB] border-b border-blue-700 sticky top-0 z-50 h-[70px] flex items-center">
      <nav className="container max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <Logo />
        <div className="flex items-center gap-4">
          <button className="text-white opacity-90 hover:opacity-100">
            <TbInfoCircle size={24} />
          </button>

          {/* --- MODIFIED: Replaced manual logic with DropdownMenu --- */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-500 focus:ring-white">
                <Avatar className="h-9 w-9 cursor-pointer">
                  <AvatarFallback className="bg-white/20 text-white font-semibold">
                    {fallbackInitial}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
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
