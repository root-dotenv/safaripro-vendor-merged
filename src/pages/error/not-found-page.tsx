import { FiMail, FiPhone } from "react-icons/fi";
import safari_pro_logo from "../../../public/images/Safari_Pro_Blue_Logo.png";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center space-y-8">
          {/* Error Code */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 blur-3xl transform -rotate-6 scale-110"></div>
            <h1 className="relative text-[120px] md:text-[160px] font-black text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 bg-clip-text leading-none tracking-tight">
              404
            </h1>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-2xl md:text-4xl font-bold text-slate-900 tracking-tight">
                Page Not Found
              </h2>
              <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                The page you're looking for has been moved, deleted, or doesn't
                exist. Please check the URL or navigate back to continue your
                journey.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Link
                to="/"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-md shadow hover:shadow-blue-500/25 transition-all duration-300 group flex items-center gap-2 cursor-pointer"
              >
                Return to Dashboard
              </Link>

              <button
                onClick={() => window.history.back()}
                className="border border-[#DADCE0] hover:border-[#DADCE0] text-slate-700 hover:text-slate-900 font-semibold px-8 py-3 rounded-lg transition-all duration-300 group flex items-center gap-2 bg-[#FFF] hover:bg-slate-50 cursor-pointer shadow"
              >
                Go Back
              </button>
            </div>
          </div>

          {/* Support Section */}
          <div className="pt-16">
            <div className="border border-[#DADCE0] shadow shadow-slate-200/20 bg-white backdrop-blur-sm rounded-lg">
              <div className="p-8 space-y-6">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                  <img
                    src={safari_pro_logo}
                    alt="SafariPro Logo"
                    className="h-10 w-auto"
                  />
                </div>

                <div className="space-y-4">
                  <p className="text-slate-600 font-medium">
                    Need assistance? Our support team is here to help.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
                    <a
                      href="mailto:support@safaripro.com"
                      className="flex items-center justify-center gap-3 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all duration-300 text-slate-700 hover:text-blue-700 font-medium group"
                    >
                      <FiMail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Email Support</span>
                    </a>

                    <a
                      href="tel:+255689759215"
                      className="flex items-center justify-center gap-3 p-4 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-lg transition-all duration-300 text-slate-700 hover:text-blue-700 font-medium group"
                    >
                      <FiPhone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      <span>Call Us</span>
                    </a>
                  </div>
                </div>

                {/* Additional Help */}
                <div className="pt-4">
                  <p className="text-sm text-slate-500">
                    Available Monday - Friday, 8:00 AM - 6:00 PM (EAT)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-8 text-center">
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} SafariPro. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
