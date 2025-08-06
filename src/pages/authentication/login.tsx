"use client";
import { useId, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import SafariProLogo from "../../../public/images/Safari_Pro_Blue_Logo.png";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Login() {
  // State and logic for the resizable panel
  const [minPanelSize, setMinPanelSize] = useState(25);
  useEffect(() => {
    const calculateMinSize = () => {
      const screenWidth = window.innerWidth;
      const minWidthPx = 840;
      if (screenWidth > 0) {
        const minSizePercent = (minWidthPx / screenWidth) * 100;
        setMinPanelSize(Math.min(minSizePercent, 90));
      }
    };
    calculateMinSize();
    window.addEventListener("resize", calculateMinSize);
    return () => window.removeEventListener("resize", calculateMinSize);
  }, []);

  // State and logic for the login form
  const id = useId();
  const { login } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      toast.error("Please fill in all fields.");
      return;
    }
    await login(emailOrPhone, password);
  };

  return (
    <div className="w-screen h-screen">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        {/* Panel 1: Form Side (LEFT) */}
        <ResizablePanel
          defaultSize={40}
          minSize={minPanelSize}
          className="bg-white dark:bg-neutral-900"
        >
          <div className="flex flex-col h-full items-center justify-between py-6 px-12 p-6 overflow-y-auto">
            {/*  header */}
            <div className="w-full flex justify-between items-center">
              <span></span>
            </div>

            {/* Login Form Content Starts Here */}
            <div className="w-full max-w-[350px] space-y-6">
              <div className="text-center">
                {/* <img
                  src={SafariProLogo}
                  alt="SafariPro Logo"
                  className="mx-auto mb-6 w-40"
                /> */}
                <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Welcome Back!
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Enter your credentials to access your account.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <InputField
                  id={`${id}-email`}
                  icon={<FaEnvelope className="dark:text-gray-400" />}
                  placeholder="Email or Phone Number"
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => setEmailOrPhone(e.target.value)}
                />
                <div className="relative">
                  <InputField
                    id={`${id}-password`}
                    icon={<FaLock className="dark:text-gray-400" />}
                    placeholder="Enter your password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <FaEyeSlash size={18} />
                    ) : (
                      <FaEye size={18} />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`${id}-remember`}
                      className="border-[#d6d5d5] border-[1.5px] data-[state=checked]:bg-[#d6d5d5] data-[state=checked]:text-transparent"
                    />
                    <Label
                      htmlFor={`${id}-remember`}
                      className="text-sm font-normal text-gray-600 dark:text-gray-400"
                    >
                      Remember me
                    </Label>
                  </div>
                  <Link
                    className="text-sm font-semibold text-blue-600 hover:underline dark:text-blue-500"
                    to="/forgot-password"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
                >
                  Sign In
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500 dark:bg-neutral-900 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-neutral-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-neutral-700"
                  onClick={() => toast.info("Feature coming soon!")}
                >
                  <FcGoogle size={22} />
                  Google
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2.5 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-neutral-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-neutral-700"
                  onClick={() => toast.info("Feature coming soon!")}
                >
                  <FaApple size={22} className="dark:text-white" />
                  Apple
                </button>
              </div>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  className="font-semibold text-blue-600 hover:underline dark:text-blue-500"
                  to="/signup"
                >
                  Sign Up
                </Link>
              </p>
            </div>
            {/* form footer */}
            <p className="text-[#787878] text-[13px]">Powered by SafariPro</p>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="hidden lg:flex" />

        {/* Panel 2: Illustration Side (RIGHT) */}
        <ResizablePanel
          defaultSize={60}
          className="bg-[#FAF9F5] hidden lg:block"
        >
          <TooltipProvider delayDuration={0}>
            <div className="flex h-full items-center justify-center p-12">
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                    className="max-w-[600px]"
                  >
                    <img
                      src={SafariProLogo}
                      alt="SafariPro Logo"
                      className="mx-auto mb-6 w-72 cursor-pointer"
                    />
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    You can always change the picture on the hotel customization
                    panel.
                  </p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// Reusable InputField component with icon support
interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
}

const InputField = ({ icon, ...props }: InputFieldProps) => (
  <div className="relative">
    <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400">
      {icon}
    </span>
    <input
      {...props}
      className="w-full rounded-lg border-2 border-gray-200 bg-transparent px-12 py-2.5 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-600 dark:focus:border-blue-500"
      required
    />
  </div>
);
