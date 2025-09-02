// src/pages/onboarding/step0_account_option.tsx
import { useState } from "react";
import { toast } from "sonner";
import { Briefcase, User, TicketCheck } from "lucide-react";
import { useOnboardingStore } from "@/store/onboarding.store";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AccountSelectionCard } from "./account-selection-card";
import { LuDot } from "react-icons/lu";

const faqData = [
  {
    question: "What's the main difference between a Vendor and an Agency?",
    answer:
      "A Vendor directly lists and manages their own properties, tours, or services (e.g. a hotel manager). An Agency manages bookings on behalf of multiple clients and other vendors, operating through a specialized portal for third-party management.",
  },
  {
    question: "What are the main benefits of becoming a Vendor?",
    answer: (
      <ul className="flex flex-col gap-y-1.5 px-2">
        <li className="flex items-center gap-x-2">
          <LuDot />
          List your properties, tours, or rentals to thousands of potential
          customers
        </li>
        <li className="flex items-center gap-x-2">
          <LuDot />
          Manage all your offerings through a single dashboard
        </li>
        <li className="flex items-center gap-x-2">
          <LuDot />
          Receive secure payments and manage bookings efficiently
        </li>
        <li className="flex items-center gap-x-2">
          <LuDot />
          Gain access to analytics about your business performance
        </li>
        <li className="flex items-center gap-x-2">
          <LuDot />
          Get featured in our marketing campaigns to increase visibility"
        </li>
      </ul>
    ),
  },
  {
    question: "Is there a fee if I just want to book hotels or tours?",
    answer:
      "No! For users who just want to book, SafariPro is completely free. You only pay for the services you book. Our goal is to provide a seamless booking experience across the country.",
  },
  {
    question: "How does the booking process work for regular users?",
    answer: (
      <>
        <p>
          Our booking platform makes it easy to find and reserve travel
          experiences:
        </p>
        <ul className="flex flex-col gap-y-1.5 px-2">
          <li className="flex items-center gap-x-2">
            <LuDot />
            Search and filter through hundreds of options
          </li>
          <li className="flex items-center gap-x-2">
            <LuDot />
            Compare prices and read verified reviews{" "}
          </li>
          <li className="flex items-center gap-x-2">
            <LuDot />
            Secure instant confirmation for most bookings{" "}
          </li>
          <li className="flex items-center gap-x-2">
            <LuDot />
            Manage all your reservations in one place{" "}
          </li>
          <li className="flex items-center gap-x-2">
            <LuDot />
            Receive 24/7 customer support for any issues{" "}
          </li>
        </ul>
      </>
    ),
  },
  {
    question: "What features will be available for Agencies?",
    answer: (
      <ul className="flex flex-col gap-y-1.5 px-2">
        <li className="flex items-center gap-x-2">
          <LuDot />
          Dedicated dashboard for managing multiple clients
        </li>
        <li className="flex items-center gap-x-2">
          <LuDot />
          Bulk booking capabilities for group travel{" "}
        </li>
        <li className="flex items-center gap-x-2">
          <LuDot />
          Special agency rates and commission structures{" "}
        </li>
        <li className="flex items-center gap-x-2">
          <LuDot />
          Custom reporting and invoicing tools{" "}
        </li>
        <li className="flex items-center gap-x-2">
          <LuDot />
          Priority support from our agency relations team
        </li>
      </ul>
    ),
  },
  {
    question: "I've selected my account type. What are the next steps?",
    answer:
      "If you selected 'Vendor', you'll proceed to the next step to register your business details. If you chose to 'Just Book', you'll be redirected to our main booking website. For agencies, we recommend signing up for our waitlist.",
  },
];

export const Step0_AccountOption = () => {
  const { goToNextStep } = useOnboardingStore();
  const [selectedAccount, setSelectedAccount] = useState<string>("vendor");

  const handleBookingRedirect = () => {
    setSelectedAccount("booker");
    toast.info("Redirecting you to the SafariPro booking site...");
    setTimeout(() => {
      window.location.href = "https://web.safaripro.net/";
    }, 1500);
  };

  const handleAgencySelection = () => {
    setSelectedAccount("agency");
    toast.info("Agency portal is coming soon!", {
      description: "We're working hard to bring this feature to you.",
    });
  };

  const handleVendorSelection = () => {
    setSelectedAccount("vendor");
    setTimeout(() => {
      goToNextStep();
    }, 300);
  };

  return (
    <div className="w-full max-w-[920px] mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-bold inter capitalize text-slate-900 dark:text-slate-50">
          Choose Your Account Type
        </h1>
        <p className="mt-2 text-lg inter text-slate-600 dark:text-slate-400">
          Select the option that best describes how you'll use SafariPro.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AccountSelectionCard
          icon={<Briefcase className="h-7 w-7" />}
          title="I'm a Vendor"
          description="List and manage your properties, tours, or services on our platform."
          onClick={handleVendorSelection}
          isSelected={selectedAccount === "vendor"}
          showBadge
        />
        <AccountSelectionCard
          icon={<TicketCheck className="h-7 w-7" />}
          title="I just want to book"
          description="Explore and book hotels, tours, and rides across the country."
          onClick={handleBookingRedirect}
          isSelected={selectedAccount === "booker"}
          disabled
        />
        <AccountSelectionCard
          icon={<User className="h-7 w-7" />}
          title="I'm an Agency"
          description="Manage bookings for your clients through our dedicated agency portal."
          onClick={handleAgencySelection}
          isSelected={selectedAccount === "agency"}
          disabled
        />
      </div>

      <div className="mt-16">
        <div className="text-center mb-8">
          <h2 className="text-2xl inter font-semibold text-gray-700 dark:text-slate-50">
            Frequently Asked Questions
          </h2>
        </div>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-2xl mx-auto"
          defaultValue="item-2"
        >
          {faqData.map((faq, index) => (
            <AccordionItem value={`item-${index + 1}`} key={index}>
              <AccordionTrigger
                className="text-left text-[1rem] hover:no-underline
               font-medium inter"
              >
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-700 font-medium inter text-[0.9375rem] dark:text-slate-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>

      {/* === FOOTER SECTION === */}
      <div className="mt-8 text-center">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Need help deciding?{" "}
          <a
            href="https://web.safaripro.net/privacy-policy/support"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium hover:underline text-blue-600 transition-all duration-300"
          >
            Contact our support
          </a>
        </p>
      </div>
    </div>
  );
};
