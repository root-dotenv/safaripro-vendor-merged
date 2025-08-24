# Booking Flow Analysis

This document outlines the step-by-step process for creating a booking within the hotel management application. The flow is divided into two distinct paths based on the selected payment method: Cash and Mobile Payment.

---

## Cash Payment Booking Flow

This flow is designed for walk-in guests or bookings made by staff where the payment will be collected physically at the front desk.

### Stage 1: Room Search & Selection

- **Action**: The user selects a check-in and check-out date. The application sends a `GET` request to the Hotel API to find available rooms.
- **API Call**: `GET {VITE_HOTEL_BASE_URL}rooms/availability/range/?hotel_id=...&start_date=...&end_date=...`
- **Components**: `src/pages/bookings/cash-booking.tsx`, `src/pages/bookings/cash-payment/search-room.tsx`
- **Booking Object State**: Does not exist yet. The state holds an array of `Room` objects.

### Stage 2: Guest Details Entry

- **Action**: The user fills out a form with their personal details (name, phone, email), number of guests, and any special requests.
- **Components**: `src/pages/bookings/cash-booking.tsx`, `src/pages/bookings/cash-payment/guest-details.tsx`
- **Booking Object State**: A local `guestDetails` state object is populated. It is not yet a `booking` object.

### Stage 3: Booking Creation (API Call)

- **Action**: The user confirms the details. The application sends a `POST` request to the Booking API to create a booking record in the system. The `payment_method` is explicitly set to `"Cash"`.
- **API Call**: `POST {VITE_BOOKING_BASE_URL}bookings/web-create`
- **Components**: `src/pages/bookings/cash-booking.tsx`, `src/pages/bookings/cash-payment/guest-details.tsx`
- **Booking Object (Payload)**: A temporary object is constructed and sent to the server.
  ```json
  {
    "full_name": "Florence Mushi",
    "phone_number": "+255 123 456 789",
    "email": "florence@mail.com",
    "amount_required": "500.00",
    "start_date": "2025-08-24",
    "end_date": "2025-08-25",
    "payment_method": "Cash",
    "booking_status": "Processing",
    "booking_type": "Physical"
    // ... other guest details
  }
  ```

### Stage 4: Billing Review & Confirmation

- **Action**: The API responds with a `BookingConfirmation` object. The booking now exists in the database with a `payment_status` of "Pending" and a `booking_status` of "Processing". The UI displays the total amount due.
- **Components**: `src/pages/bookings/cash-booking.tsx`, `src/pages/bookings/cash-payment/guest-details.tsx` (in billing view)
- **Booking Object (from API Response)**:
  ```json
  {
    "id": "booking-uuid-123",
    "code": "BK-12345",
    "full_name": "Florence Mushi",
    "payment_status": "Pending",
    "booking_status": "Processing",
    "payment_reference": "ref-xyz-789",
    "payment_method": "Cash"
    // ... other booking details
  }
  ```

### Stage 5: Payment Registration

- **Action**: The flow moves to a screen where the front-desk staff enters the amount of cash received from the guest. Upon submission, a `PATCH` request is sent to the Booking API to update the existing booking record.
- **API Call**: `PATCH {VITE_BOOKING_BASE_URL}bookings/{booking_id}`
- **Components**: `src/pages/bookings/cash-booking.tsx`, `src/pages/bookings/cash-payment/payment.tsx`
- **Booking Object (Update Payload)**:
  ```json
  {
    "booking_status": "Confirmed",
    "currency_paid": "TZS",
    "amount_paid": "1150000.00"
  }
  ```

### Stage 6: Final Confirmation & Check-in

- **Action**: The booking is now fully confirmed and paid for. The final screen displays a printable receipt/ticket. It fetches the complete booking details to show the final state. The user can now click "Check-In Guest".
- **API Call**: `GET {VITE_BOOKING_BASE_URL}bookings/{booking_id}` (to fetch final details)
- **Components**: `src/pages/bookings/cash-booking.tsx`, `src/pages/bookings/cash-payment/checkin-guest.tsx`
- **Booking Object (Final State)**:
  ```json
  {
    "id": "booking-uuid-123",
    "code": "BK-12345",
    "payment_status": "Paid",
    "booking_status": "Confirmed",
    "amount_paid": "1150000.00",
    "checkin": null
    // ... all other final details
  }
  ```

---

## Mobile Payment Booking Flow

This flow is for guests who want to pay for their booking immediately online using a mobile money provider.

### Stage 1 & 2: Room Search and Guest Details

- These stages are identical to the Cash Payment flow. The user searches for a room and enters their details.
- **Components**: `src/pages/bookings/mobile-booking.tsx`, `src/pages/bookings/mobile-payment/search-room.tsx`, `src/pages/bookings/mobile-payment/guest-details.tsx`

### Stage 3: Booking Creation (API Call)

- **Action**: The user confirms their details. The application sends a `POST` request to the Booking API. The only difference in the payload from the cash flow is the `payment_method`.
- **API Call**: `POST {VITE_BOOKING_BASE_URL}bookings/web-create`
- **Components**: `src/pages/bookings/mobile-booking.tsx`, `src/pages/bookings/mobile-payment/guest-details.tsx`
- **Booking Object (Payload)**:
  ```json
  {
    "full_name": "John Doe",
    "phone_number": "2557... ",
    "email": "john.doe@email.com",
    "payment_method": "Mobile", // Key difference
    "booking_status": "Processing"
    // ... other details
  }
  ```

### Stage 4: Billing Review & Payment Intent

- **Action**: The API returns a `BookingConfirmation` object, just like in the cash flow. The booking exists with a `payment_status` of "Pending". The UI displays the charge breakdown and prompts the user to proceed to the payment step.
- **Components**: `src/pages/bookings/mobile-booking.tsx`, `src/pages/bookings/mobile-payment/guest-details.tsx` (in billing view)
- **Booking Object (from API Response)**:
  ```json
  {
    "id": "booking-uuid-456",
    "code": "BK-54321",
    "payment_status": "Pending",
    "booking_status": "Processing",
    "payment_reference": "ref-abc-123", // Crucial for the next step
    "payment_method": "Mobile"
    // ... other details
  }
  ```

### Stage 5: Mobile Payment Request

- **Action**: The user is presented with a form to enter their mobile phone number (for payment) and confirm the amount. A `POST` request is sent to the **Payment API** (a different microservice), using the `payment_reference` from the previous step to link the payment to the booking.
- **API Call**: `POST {VITE_PAYMENT_BASE_URL}checkout`
- **Components**: `src/pages/bookings/mobile-booking.tsx`, `src/pages/bookings/mobile-payment/payment.tsx`
- **Payment Object (Payload)**:
  ```json
  {
    "referenceId": "ref-abc-123", // From the booking object
    "amount": "1150000.00",
    "accountNumber": "2557..."
  }
  ```
- **User Action**: The Payment API triggers a push notification to the user's phone, asking them to confirm the payment by entering their PIN.

### Stage 6: Awaiting Payment & Final Confirmation

- **Action**: The UI shows a loading/waiting screen, indicating that it's verifying the payment. The user completes the transaction on their phone. In the background, the Payment Service confirms the transaction and notifies the Booking Service to update the booking's status. The UI then fetches the final booking details.
- **API Call**: `GET {VITE_BOOKING_BASE_URL}bookings/{booking_id}` (polls or waits before fetching)
- **Components**: `src/pages/bookings/mobile-booking.tsx`, `src/pages/bookings/mobile-payment/checkin-guest.tsx`
- **Booking Object (Final State)**: After successful payment, the final object is fetched and has the same structure as the cash flow's final state.
  ```json
  {
    "id": "booking-uuid-456",
    "code": "BK-54321",
    "payment_status": "Paid",
    "booking_status": "Confirmed",
    "amount_paid": "1150000.00",
    "checkin": null
    // ... all other final details
  }
  ```
