// src/pages/onboarding/onboarding-footer.tsx

const footerLinks = [
  {
    name: "Terms",
    href: "https://web.safaripro.net/privacy-policy/terms",
  },
  {
    name: "Privacy",
    href: "https://web.safaripro.net/privacy-policy",
  },
  {
    name: "Cookies",
    href: "https://web.safaripro.net/privacy-policy/cookies",
  },
  {
    name: "Support",
    href: "https://web.safaripro.net/privacy-policy/support",
  },
];

export default function OnboardingFooter() {
  return (
    <footer className="w-full bg-none shadow border-t border-gray-200 py-5 mt-6">
      <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-gray-500">
          © 2025 SafariPro by Smartinno Engineering Ltd, All rights reserved.
        </p>
        <nav className="flex items-center gap-x-6">
          {footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              {link.name}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
