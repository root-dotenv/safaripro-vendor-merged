# Redesign Guide: "Pay with Cash" Booking Flow

This document serves as the official guide for the redesign of the "Pay with Cash" booking workflow. Its purpose is to outline the specific changes we will make to the user interface and component architecture, while strictly preserving the core business logic and API interactions.

---

## 1. Guiding Principles

Our redesign is guided by two primary objectives:

1.  **Design Unification**: To create a consistent and professional user interface by strictly adhering to the styles and reusable components defined in the `form-stylings.md` guide.
2.  **Improved User Experience**: To transition from a multi-page "wizard" flow to a single-page, progressively-enabled layout. This provides users with a clearer overview of the entire booking process from the start.

---

## 2. What We WILL Change (Presentation Layer)

The following changes are the focus of this redesign.

- **Architectural Shift**:

  - We will restructure the flow so that all steps (Room Search, Guest Details, Payment Confirmation) are rendered on a **single page**.
  - Subsequent steps will be visible but **disabled** until the preceding step is successfully completed.

- **Component & Styling Implementation**:

  - We will rebuild all forms using the reusable **`FormField`** and **`MultiSelectField`** components from the styling guide.
  - We will implement the specified layout structure: `bg-gray-50/50` for the page background and a `p-6 bg-white border border-gray-200 rounded-lg` container for form sections.
  - All action buttons will be styled and positioned according to the guide, including support for loading states.

- **State Management Adaptation**:
  - The central state within `cash-booking.tsx` will be adapted to manage the `enabled`/`disabled` status of each step on the single page.

---

## 3. What We WILL NOT Change (Core Logic)

To ensure stability and prevent regressions, the following areas are strictly out of scope for this redesign.

- **Business Logic Flow**:

  - The fundamental sequence of operations will remain unchanged:
    1.  Search for rooms.
    2.  Select a room.
    3.  Enter guest details.
    4.  Create the booking via API call.
    5.  Register the cash payment via API call.
    6.  Display confirmation.

- **API Functionality & Data Structures**:

  - We will **not** alter any API endpoints, request methods (`GET`, `POST`, `PATCH`), or the structure of the data payloads sent to the server.
  - The shape of the data received from the API will continue to be handled as it currently is.

- **Form Validation**:
  - The existing **Zod schemas** and associated validation rules will be preserved and reapplied to the new form components. We are only changing the visual presentation of the fields and errors, not the rules themselves.
