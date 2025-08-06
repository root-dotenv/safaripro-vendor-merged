// src/pages/error/not-found-page.tsx
import { Link } from "react-router-dom";
import { FiMail, FiPhone } from "react-icons/fi";
import safari_pro_logo from "../../../public/images/Safari_Pro_Blue_Logo.png";

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-[#F0F6FC] to-[#FFFC] p-4">
      <div className="w-full max-w-2xl text-center">
        <div>
          {/* <FiAlertTriangle className="mx-auto h-16 w-16 text-red-500" /> */}
          <h1 className="mt-8 text-[96px] font-bold text-gray-900 tracking-normal">
            404
          </h1>
          <h2 className="mt-4 text-3xl font-semibold text-gray-800">
            Page Not Found
          </h2>
          <p className="mt-4 text-[1.125rem] text-gray-600">
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </p>
        </div>

        <div className="mt-10">
          <Link
            to="/"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-[#2463EB] text-white font-bold hover:bg-blue-700 transition-all duration-300 hover:shadow-blue-500/40"
          >
            Return to Homepage
          </Link>
        </div>

        <div className="mt-16 border-t border-gray-200 pt-10">
          <img
            src={safari_pro_logo}
            alt="SafariPro Logo"
            className="mx-auto h-8"
          />
          <p className="mt-4 text-sm text-gray-500">
            If you believe this is an error, please contact our support team.
          </p>
          <div className="mt-6 flex justify-center gap-8">
            <a
              href="mailto:support@safaripro.com"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
            >
              <FiMail size={18} />
              Email Support
            </a>
            <a
              href="tel:+255689759215"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium"
            >
              <FiPhone size={18} />
              Call Us
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
