# Tech Stack & Standards

_Last updated: 2025-08-16_

This document outlines the **core technologies** and **engineering standards** for the Belize Car Marketplace mobile app. It provides developers with a single source of truth on what stack we are using, why we chose it, and how it should be applied.

---

## 1) Frontend

- **Framework:** [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
- **Language:** TypeScript
- **Navigation:** [Expo Router](https://expo.github.io/router/) (file-based navigation)
- **UI Library:** [GlueStack V2](https://gluestack.io/) with [NativeWind](https://www.nativewind.dev/) for utility-first styling

### Standards

- All new components must be written in **TypeScript**.
- Use **functional components** and React hooks; no class components.
- Styling should default to **NativeWind** utilities. Only extend with GlueStack primitives when utilities are insufficient.
- Reusable UI components (e.g., buttons, form inputs, cards) should live in `/components/ui`.

---

## 2) Backend & Data Layer

- **Backend-as-a-Service:** [Convex](https://convex.dev/)
- **Reasoning:** Provides real-time sync out of the box, enabling responsive buyer-seller chat and live updates on listings.
- **Data Model:** Defined in Convex schema functions (see `/convex/schema.ts`).
- **Business Logic:** Convex serverless functions will handle mutations (create listing, update listing, flag listing, leave review, etc.).

### Standards

- Use **Convex queries** for reads and **Convex mutations** for writes.
- All data access must go through Convex — no direct database connections.
- Validate all incoming mutation payloads with **Zod** (or Convex built-in validators).

---

## 3) Authentication

- **Provider:** [Clerk](https://clerk.com/)
- **Integration:** React Native Expo SDK (`@clerk/clerk-expo`)
- **Login Method:** Just Gmail Sign In for now.

### Standards

- User identity stored in Convex using Clerk’s user ID as the primary key.
- All authenticated requests must validate Clerk JWTs server-side in Convex.
- Profile fields: name, phone, optional profile photo.

---

## 4) VIN Integration (Future)

- **Phase 1:** Free VIN decode + recall lookup using [NHTSA vPIC](https://vpic.nhtsa.dot.gov/api/).
- **Phase 2:** Paid NMVTIS provider (ClearVin or VinAudit) for title/accident/salvage history.

_Note: This will be tracked in a separate integration doc once finalized._

---

## 5) Development Standards

- **Version Control:** GitHub, `main` branch protected.
- **Code Style:** ESLint + Prettier with project rules enforced in CI.
- **Commits:** Conventional Commits format (`feat:`, `fix:`, `chore:`).
- **CI/CD:** Expo EAS builds (staging + production channels).

---
