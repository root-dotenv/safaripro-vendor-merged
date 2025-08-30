import { useState, useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";

// UI & Icons
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaEye, FaEyeSlash, FaEnvelope, FaLock } from "react-icons/fa";
import { Loader2 } from "lucide-react";
import SafariProLogo from "../../../public/images/Safari_Pro_Blue_Logo.png";
import LightRays from "@/components/custom/light-rays";

// Validation Schema
const loginSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Email or Phone Number is required." }),
  password: z.string().min(1, { message: "Password is required." }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// The Main Component
export default function LoginPage() {
  // --- State and Hooks ---
  const navigate = useNavigate();
  // Destructuring the CORRECTED auth store state and actions
  const { login, isLoading, isAuthenticated, error, onboardingCompleted } =
    useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [minPanelSize, setMinPanelSize] = useState(25);

  // --- Form Setup ---
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  // --- Effects ---
  // CORRECTED: Redirection logic based on the new onboarding flow
  useEffect(() => {
    if (isAuthenticated) {
      if (onboardingCompleted) {
        // If onboarding is done, go to the main dashboard
        navigate("/", { replace: true });
      } else {
        // If onboarding is NOT done, go to the wizard
        navigate("/onboarding", { replace: true });
      }
    }
  }, [isAuthenticated, onboardingCompleted, navigate]);

  // Effect for making the resizable panel responsive
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

  // --- Handlers ---
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // The login function is now correctly defined in the store
      await login(data);
    } catch (err) {
      // The store's login function already shows a toast on error
      console.error("Login failed from component:", err);
    }
  };

  // --- JSX ---
  return (
    <div className="w-screen h-screen inter">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        {/* Panel 1: Form Side (LEFT) */}
        <ResizablePanel
          defaultSize={40}
          minSize={minPanelSize}
          className="bg-white dark:bg-neutral-900"
        >
          <div className="flex flex-col h-full items-center justify-between py-6 px-12 p-6 overflow-y-auto">
            <div className="w-full flex justify-between items-center">
              <span></span>
            </div>

            <div className="w-full max-w-[350px] space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white">
                  Welcome Back
                </h2>
                {error ? (
                  <p className="mt-2 text-red-600 text-sm animate-pulse">
                    {error}
                  </p>
                ) : (
                  <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Enter your login credentials to proceed.
                  </p>
                )}
              </div>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-[1rem]">
                          Email or Phone Number
                        </FormLabel>
                        <FormControl>
                          <InputField
                            icon={<FaEnvelope className="dark:text-gray-400" />}
                            placeholder="e.g. manager@hotel.com"
                            type="text"
                            disabled={isLoading}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 text-[1rem]">
                          Password
                        </FormLabel>
                        <div className="relative">
                          <FormControl>
                            <InputField
                              icon={<FaLock className="dark:text-gray-400" />}
                              placeholder="Enter your password"
                              type={showPassword ? "text" : "password"}
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-blue-600 transition-all dark:text-gray-400 dark:hover:text-[#0081FB]"
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
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch id="remember-me" />
                      <Label
                        htmlFor="remember-me"
                        className="text-sm font-normal text-gray-600 dark:text-gray-400"
                      >
                        Remember me
                      </Label>
                    </div>
                    <Link
                      className="text-sm font-medium text-[#0081FB] hover:underline dark:text-blue-500"
                      to="/forgot-password"
                    >
                      Forgot password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="w-full px-8 py-2 bg-[#0081FB] text-white font-medium rounded-md hover:bg-blue-600 transition-colors hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0081FB] dark:bg-[#0081FB] dark:hover:bg-blue-600 flex items-center justify-center disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
                    disabled={isLoading}
                  >
                    {isLoading && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Sign In
                  </button>
                </form>
              </Form>

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
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-neutral-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => toast.info("Feature coming soon!")}
                  disabled
                >
                  <FcGoogle size={22} />
                  Google
                </button>
                <button
                  type="button"
                  className="flex w-full items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:bg-neutral-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => toast.info("Feature coming soon!")}
                  disabled
                >
                  <FaApple size={22} className="dark:text-white" />
                  Apple
                </button>
              </div>
            </div>

            <p className="text-gray-500 text-xs tracking-wider uppercase">
              Powered by SafariPro
            </p>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="hidden lg:flex" />

        {/* Panel 2: Illustration Side (RIGHT) */}
        <ResizablePanel
          defaultSize={60}
          className="bg-[#FFF] hidden lg:block relative"
        >
          {/* <div className="absolute inset-0">
            <LightRays
              raysOrigin="top-center"
              raysColor="#F6FFFF"
              raysSpeed={1.5}
              lightSpread={0.8}
              rayLength={1.2}
              followMouse={true}
              mouseInfluence={0.1}
              noiseAmount={0.1}
              distortion={0.05}
              className="w-full h-full"
            />
          </div> */}
          <TooltipProvider delayDuration={0}>
            <div className="flex h-full items-center justify-center p-12 relative z-10">
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
                  <p>Manage your hotel with SafariPro.</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

// Reusable InputField component
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
      className="w-full rounded-lg border-2 border-gray-200 bg-transparent px-12 py-2.5 transition-colors focus:border-[#0081FB] focus:outline-none focus:ring-1 focus:ring-[#0081FB] dark:border-gray-600 dark:focus:border-blue-500"
      required
    />
  </div>
);
