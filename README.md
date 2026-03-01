# The Nightshift Event – Private Ticketing Platform

A self-hosted Ticket Wings-style website for **Shama & Soul** with fully controllable passes, phases, pricing, QR entry, volunteer management, and role-based admin panel.

## Stack
- Frontend: React + Tailwind CSS
- Backend: Node.js + Express
- Database: MongoDB
- Auth: OTP (dummy console OTP)
- Sessions: JWT
- Payments: Razorpay test mode
- Tickets: unique ID + QR code generation

## Features
- Dynamic pass system (create/update/reorder/activate/sold-out)
- Public pass listing hides expired/sold-out/inactive tickets
- OTP login for users and organizers
- Razorpay test order creation + signature verification
- Ticket generation with QR and entry status tracking
- Staff scanner endpoint preventing duplicate entries
- Volunteer registration + admin approve/reject
- Super admin dashboard:
  - Event content management
  - Pass controls
  - Sales analytics
  - Admin management

## Folder Structure
- `backend/` Express API + Mongo schemas + auth/payment/ticket logic
- `frontend/` React UI for public booking + admin/staff panels
- `.env.example` environment template

## Setup
1. Copy env template:
   - `cp .env.example backend/.env`
   - Create `frontend/.env` and add `VITE_*` vars from template.
2. Install dependencies:
   - `npm install --prefix backend`
   - `npm install --prefix frontend`
3. Start MongoDB locally.
4. Run backend:
   - `npm run dev --prefix backend`
5. Run frontend:
   - `npm run dev --prefix frontend`

## Sample Super Admin Credentials
When `SEED_SUPER_ADMIN=true`, seed user:
- Name: `Agamweer`
- Phone: `9999999999`
- Email: `agamweer@nightshift.local`
- Role: `super_admin`

Login flow uses OTP; request OTP on login page and use console OTP from backend logs.

## Important Notes
- No pass/pricing is hardcoded in admin workflows; everything editable through super admin controls.
- Dummy payment simulation is wired for local test mode while still using Razorpay order/signature flow.
- For production, secure secrets, use real OTP provider, and Razorpay checkout UI.
