# UI Guidelines

_Last updated: 2025-08-16_

This document defines the visual system for the Belize-only car marketplace app. It covers color, typography, spacing, components, and patterns for React Native + Expo using **GlueStack V2** and **NativeWind**.

---

## 1) Brand & Colors

### Brand Intent

Belize-first, trust-forward. Clean light UI with strong Belize flag accents.

### Palette (Light Mode Only)

- **Primary (Belize Blue):** `#003F87`
- **Danger (Flag Red):** `#D81E05`
- **Success (Wreath Green):** `#138808` (used sparingly for success/verification)
- **Warning (Amber):** `#F59E0B` (utility)

**Neutrals (Gray scale)**

```
--neutral-50:  #FAFAFA
--neutral-100: #F5F5F5
--neutral-200: #E5E5E5
--neutral-300: #D4D4D4
--neutral-400: #A3A3A3
--neutral-500: #737373
--neutral-600: #525252
--neutral-700: #404040
--neutral-800: #262626
--neutral-900: #171717
--neutral-950: #0A0A0A
```

**Extended tokens**

```
--bg:            var(--neutral-50)
--surface:       #FFFFFF
--text:          #111111
--text-muted:    var(--neutral-600)
--border:        var(--neutral-200)
--focus:         #2563EB
```

**Semantic colors**

```
--btn-primary-bg:        #003F87
--btn-primary-text:      #FFFFFF
--btn-primary-press:     #003471

--btn-secondary-bg:      var(--neutral-100)
--btn-secondary-text:    #111111
--btn-secondary-border:  var(--neutral-200)

--danger-bg:             #D81E05
--danger-text:           #FFFFFF
--danger-press:          #B81805

--success-bg:            #138808
--success-text:          #FFFFFF

--chip-clean:            #0E9F6E
--chip-salvage:          #B91C1C
--chip-rebuilt:          #92400E
```

---

## 2) Typography

**Font Family:** System fonts (SF Pro on iOS, Roboto on Android).  
**Style:** Clean, modern, legible.

**Type Scale**

- Display: 28/32, semibold
- H1: 24/28, semibold
- H2: 20/24, semibold
- Body: 16/22, regular
- Caption: 13/18, regular
- Label/Overline: 12/16, medium

Line-height: 1.3–1.4 for headings, 1.35–1.5 for body.

---

## 3) Spacing, Radius, Elevation

- **Spacing Scale (px):** 4, 8, 12, 16, 20, 24, 32
- **Corner Radius:** 12 for cards/inputs, 999 for chips/pills
- **Shadows:**
  - Card: elevation 2 (subtle)
  - FAB/float: elevation 6–8 (stronger)

---

## 4) Components

### Buttons

- **Primary:** solid Belize Blue, white text, radius 12, height 48, medium weight.
- **Secondary:** neutral-100 bg, neutral-200 border, black text.
- **Destructive:** solid Flag Red, white text.
- **States:**
  - Pressed: darken by ~10%
  - Disabled: opacity 50%, maintain contrast

**Sizes**

- Large: H56, paddingX 20, font 17/24
- Default: H48, paddingX 16, font 16/22
- Small: H40, paddingX 14, font 14/20

### Inputs

- Style: Filled, neutral-100 bg, neutral-200 border, radius 12.
- Focus: border Belize Blue.
- Error: border Red, helper text in Red.
- Icon support: 16–20px left-aligned.

### Chips / Badges

- Clean: green bg, white text
- Salvage: red bg, white text
- Rebuilt: amber bg, white text
- Radius 999, paddingX 8, height 24, font 12/16 medium.

### Cards

- **Listing Card**

  - Image (16:9) top, radius 12
  - Title (Year Make Model Trim)
  - Price (bold)
  - Title badge (Clean/Salvage/Rebuilt)
  - Row: Mileage • Transmission • District
  - Border neutral-200, bg white, subtle shadow

- **Seller Card**
  - Avatar, name, reputation badge (0–100), response rate.

### Navigation

- **Tab Bar:** Home, Search, Sell, Inbox, Profile
- **Top Bar:** Title centered, filter button right
- **Floating Action:** Optional FAB for “Sell”

### Modals & Sheets

- **Bottom sheet:** Filters, sort options
- **Modal:** Review (thumbs up/down), preset reasons, 140-char text

### Reviews

- Thumbs Up/Down buttons with counts
- Downvote requires reason
- “Anonymous” toggle with tooltip

---

## 5) Patterns

### Listing Creation Wizard

1. Basics (Year/Make/Model/Trim/Title Type/Imported?)
2. Specs (Mileage/Transmission/Fuel/Price/District)
3. Issues Checklist (or “No known issues”)
4. Media (guided photos + cold-start video) + optional VIN

Publish disabled until required fields + media uploaded.

### Filters

- Chips show active filters
- Sticky “Apply” button at bottom
- “Reset” on left side

### Empty States

- Minimal illustration + friendly text + CTA
- Example: “No clean-title cars in Cayo yet.” → CTA: “Expand search”

### Error States

- Plain language message + Retry button
- Example: “Couldn’t fetch listings. Check connection and try again.”

---

## 6) Accessibility

- Color contrast ≥ 4.5:1 for text
- Hit targets ≥ 44×44 px
- Visible focus ring on inputs/buttons
- Animations ≤ 150ms, reduced-motion respected

---

## 7) Content & Microcopy

- Actions: use verbs (“Message Seller”, “Save Search”)
- Reviews: “Keep it factual. Personal attacks are not allowed.”
- VIN helper: “If imported from the U.S., add your VIN so buyers can verify title history.”
- Completeness helper: “Higher completeness = better ranking and more views.”

---

## 8) Example NativeWind Recipes

```ts
// Primary button
tw`h-12 px-4 rounded-xl items-center justify-center bg-[#003F87]`;

// Secondary button
tw`h-12 px-4 rounded-xl items-center justify-center bg-neutral-100 border border-neutral-200`;

// Input
tw`h-12 px-4 rounded-xl bg-neutral-100 border border-neutral-200`;

// Card
tw`rounded-xl bg-white border border-neutral-200 shadow-sm`;
```

---

## 9) Assets

- **Logo/App Icon:** Belize Blue base, white or green accent
- **Illustrations:** Minimal, flat line icons for empty states
- **Icons:** Lucide icons, 1.5–2 stroke, consistent weight

---

## 10) Do & Don’t

- ✅ Always show Title Type badge on listings
- ✅ Use Belize Blue only for primary CTAs
- ✅ Require photo angle overlays for sellers
- ❌ Don’t use red outside errors/danger
- ❌ Don’t allow publishing without required fields/media

---
