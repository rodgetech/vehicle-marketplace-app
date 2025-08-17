# Belize Car Marketplace — Product Requirements Document (PRD)

_Last updated: 2025-08-16_

## 1) One-liner

A **Belize-only, cars-only** marketplace that enforces transparent listings (title type, known issues, mandatory photos/video, optional VIN checks) and uses community signals to rank trustworthy sellers so buyers **don’t waste time**.

## 2) Problem & Why Now

- Facebook groups/Marketplace dominate car sales in Belize but **omit critical info** (salvage/clean title, oil leaks, damages), wasting buyer time and eroding trust.
- Many cars are imported from the U.S., where **salvage/rebuilt** histories are common; sellers may not disclose unless asked explicitly.
- There is **no Belize-focused** car-only app with enforced fields, structured filters, or reputation.

## 3) Target Users

- **Buyers** (budget-conscious, value time, want transparency).
- **Sellers** (private owners and small lots) who want qualified, serious buyers.
- **Partner mechanics** (later): provide verification inspections.

## 4) Value Proposition

- **For buyers:** accurate listings with filters that matter (title type, issues, mileage, etc.), optional VIN/recall checks, fewer wasted meetups.
- **For sellers:** reach serious buyers and earn **reputation** through honest disclosure; optional badges/boosts to increase visibility.

## 5) Success Metrics (MVP → 90 days post-launch)

- ≥ 500 active users in Belize; ≥ 150 live listings.
- ≥ 60% of listings with **complete required media** (all angles + odometer + engine bay).
- ≥ 40% listings with **VIN decoded**; ≥ 15% with **VIN history** purchased.
- Median time-to-first-message ≤ 24 hours.
- ≥ 70% of meetups marked **Verified** via QR.
- < 5% upheld “omitted issue” rate per listing.

## 6) Scope — MVP Feature Set

### 6.1 Listings (Create/Read)

**Required fields**: Title Type (Clean/Salvage/Rebuilt), Year, Make, Model, Trim, Mileage, Transmission, Fuel Type, Price (BZD), District, Imported from U.S.? (Y/N), Known Issues (checklist or “No known issues”).
**Required media**: Photos: front, rear, left, right, interior (dash/odometer), **engine bay**, tires; optional **cold-start** video.
**Optional**: VIN (required if Imported from U.S.=Yes, phased rollout acceptable).
**Auto-computed**: Listing Completeness Score (0–100).

### 6.2 Search & Filters

Filters: Title Type, Price range (BZD), Mileage, Transmission, District, Imported from U.S., Issues (hide/show), VIN Verified, Mechanic-Verified (future), Photo count ≥ N. Sort by: Recommended (ranking score), Newest, Price, Mileage.

### 6.3 Trust & Community

- **Thumbs Up/Down** per listing with preset reasons on Down: _Undisclosed salvage_, _Mechanical issue omitted_, _No-show_, _Bait-and-switch price_, _Other + text (≤140 chars)_. Optional photo evidence.
- **Anonymous posting** toggle for the review, but **internal user identity is always stored**.
- **Meetup Verified**: Seller shows in-app QR; Buyer scans → can now rate. (Only meetup-verified buyers can rate in MVP.)
- **Seller Reputation** (0–100): last 90 days weighted by verified meetups, upheld omission flags, response rate, completion of required fields across listings. Old feedback decays.

### 6.4 Ranking (Feed Ordering)

```
ListingScore = 0.50 * ListingCompleteness
              + 0.25 * SellerReputation
              + 0.15 * MeetupVerifiedRatio
              + 0.10 * VINSignals
              - Penalties
```

**Penalties:** upheld omission flags, VIN mismatch (seller marked Clean, report shows Salvage/Rebuilt), excessive no-shows. Low-score listings are still discoverable via filters but appear later (“back of the queue”).

### 6.5 Messaging

- In-app chat with quick prompts: “Is this salvage/clean?”, “Any oil leaks?”, “Last service date?”, “Cold-start video?”
- Optional link-out to WhatsApp (opens prefilled template); keep primary messaging in-app for auditability.

### 6.6 VIN & Recalls (Phaseable)

- **Phase 1 (Free)**: NHTSA vPIC decode + recall lookup (if available) to enrich specs and show recall advisories.
- **Phase 2 (Paid)**: Integrate one NMVTIS provider (e.g., ClearVin/VinAudit) server-to-server for title brands (salvage, rebuilt, flood), theft, odometer, lien data. Seller/Buyer can purchase a report; show summarized badges.

### 6.7 Moderation & Safety

- Review queue for “omitted issue” flags: moderator can Uphold/Dismiss/Request Amendment. If upheld, seller must amend listing; failure triggers down-rank + posting cooldown (48–72h).
- **Rate limits** on reviews/flags per account/IP/day. Phone verification to post listings.
- **Content policy**: allow factual claims; block insults/defamation; limit review text to 140 chars + presets.

### 6.8 Notifications

- Push: new message, meetup scheduled, amendment requested, saved-search match.
- Email/SMS fallback (optional) for critical events.

### 6.9 Admin/Moderator Tools (MVP-light)

- Dashboard: listing details, VIN results (if any), history of flags, media gallery, decision log, action buttons.

## 7) Non-Goals (MVP)

- Payments/escrow. (Belize gateways are limited; consider manual deposits via bank transfer later.)
- Price analytics/valuation models.
- Desktop web app (mobile-first RN Expo app; web can come later via Expo Web if needed).

## 8) User Stories & Acceptance Criteria

### Buyer

1. **Filter out salvage listings**

   - _Given_ I toggle **Title Type=Clean**, _when_ I open feed, _then_ only Clean titles appear (unless I explicitly open a filtered Salvage tab).

2. **See mandatory photos**

   - _Given_ a listing, _then_ I see front/rear/sides/interior/odometer/engine-bay thumbnails. Missing a required photo → listing cannot be published.

3. **VIN insight** (phase 1)

   - _Given_ VIN present, _then_ app shows basic decode (year/make/model) and recall advisories (if any).

4. **Rate meetup**

   - _Given_ I scanned the seller’s QR at meetup, _then_ I can leave thumbs up/down with a preset reason and optional photo.

### Seller

1. **Create listing**

   - _Given_ I fill all required fields and upload required media, _then_ I can publish; otherwise the Publish button is disabled with inline errors.

2. **Meetup QR**

   - _Given_ I have an active listing, _then_ I can display a per-listing QR so a buyer can verify meetup.

3. **Amend after flag**

   - _Given_ an omission is upheld, _then_ I must update the relevant field(s) before the listing re-enters normal ranking; failure triggers cooldown.

### Moderator

1. **Adjudicate a flag**

   - _Given_ a flagged listing, _then_ I can view summary, media, VIN data, review/evidence, and decide with a single click; result instantly updates listing rank.

## 9) Information Architecture & Flows

- **Home/Feed** → Card grid (title, price, district, badges, quick chips for Title type/VIN/Mechanic if present). Sort selector top-right.
- **Filters Sheet** → Multi-select chips + sliders (price, mileage). Persistent “Saved Search.”
- **Listing Detail** → Gallery, key facts (Title, Mileage, Transmission), Issues section, VIN section, Seller card (Reputation, response rate), buttons: **Message**, **Meetup QR** (for sellers only).
- **Create Listing Wizard** → 4 steps: (1) Basics (Year/Make/Model/Trim/Title Type/Imported?), (2) Specs (Mileage/Transmission/Fuel), (3) Issues checklist, (4) Media upload (guide overlays for angles) + optional Cold-start video + VIN.
- **Meetup Verification** → Seller displays QR (contains listingId + sellerId + nonce); Buyer scans → confirmation toast + eligibility to rate.
- **Review Modal** → Thumbs Up/Down, required reason on Down, text ≤140, optional photo.

## 10) Security, Privacy, Safety

- Phone verification to post listings; optional email.
- Store reviewer identity even if review is anonymous to the public.
- Log all moderator actions (who/when/what).
- Keep evidence photos private (visible to mods + involved parties) unless both parties consent.
- Data retention: purge geolocation from meetups after 30 days.

## 11) Legal & Policy Notes (Belize context)

- Clear Terms: platform is an **information venue**; buyer due diligence remains necessary; no warranties on vehicle condition.
- Defamation risk: restrict review text to facts + presets; profanity filter; moderation guidelines.
- Copyright: ensure you have rights to uploaded media; forbid stealing dealer photos.

## 12) Ranking & Scoring (Engineering Notes)

- Compute **ListingCompleteness** at publish + on edits. Weighted sub-scores: required photos present (40%), issues answered (20%), VIN present (20%), cold-start video (10%), odometer close-up (10%).
- **VINSignals**: + points for VIN present, + for report purchased, - for mismatch with declared title.
- Apply exponential decay to **SellerReputation** components beyond 90 days.

## 13) Monetization (Post-MVP ready)

- Promoted listings (7-day boost).
- VIN history upsell (rev-share on report).
- Mechanic verification badge (partner fee share).

## 14) Risks & Mitigations

- **Low VIN adoption** → make VIN optional at first but **required if Imported from U.S.**; educate with in-app tips.
- **Review abuse** → meetup-gated reviews + rate limits + moderator queue.
- **Seller drop-off due to friction** → wizard UX, progress save, photo angle guides, “Publish anyway” with soft warnings (but keep _minimum_ requirements hard).

## 15) Open Questions (Track in backlog)

- Which NMVTIS provider first (pricing, API terms)?
- Do we require VIN for **all** listings by month 3?
- Do we support bank transfer proof upload for deposits (no payment rails at launch)?

---

### Appendix A — Copy & Microcopy (Draft)

- **VIN helper**: “If imported from the U.S., add your VIN so buyers can verify title history.”
- **Review helper**: “Reviews must be factual. Choose a reason and add a short note. Personal attacks are not allowed.”
- **Completeness tooltip**: “Higher completeness = better ranking and more views.”

### Appendix B — Moderator Decision Guide (MVP)

- _Undisclosed salvage_ with VIN proof → Uphold + require Title Type update + temporary down-rank + cooldown.
- _No-show_ (2+ verified reports in 30 days) → temporary down-rank.
- _Bait-and-switch price_ → require price correction within 24h.

---
