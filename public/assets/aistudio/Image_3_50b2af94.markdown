---
name: Warm Radiant Keepsake
colors:
  surface: '#fbf8ff'
  surface-dim: '#dbd9e1'
  surface-bright: '#fbf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f2fb'
  surface-container: '#efecf5'
  surface-container-high: '#eae7ef'
  surface-container-highest: '#e4e1ea'
  on-surface: '#1b1b21'
  on-surface-variant: '#59413c'
  inverse-surface: '#303036'
  inverse-on-surface: '#f2eff8'
  outline: '#8d716a'
  outline-variant: '#e1bfb8'
  surface-tint: '#ae3115'
  primary: '#ae3115'
  on-primary: '#ffffff'
  primary-container: '#ff6b4a'
  on-primary-container: '#661000'
  inverse-primary: '#ffb4a3'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#005ac2'
  on-tertiary: '#ffffff'
  tertiary-container: '#6198ff'
  on-tertiary-container: '#002f6d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad2'
  primary-fixed-dim: '#ffb4a3'
  on-primary-fixed: '#3d0600'
  on-primary-fixed-variant: '#8c1900'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#d8e2ff'
  tertiary-fixed-dim: '#adc6ff'
  on-tertiary-fixed: '#001a42'
  on-tertiary-fixed-variant: '#004395'
  background: '#fbf8ff'
  on-background: '#1b1b21'
  surface-variant: '#e4e1ea'
typography:
  display-lg:
    fontFamily: Poppins
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Poppins
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 38px
    letterSpacing: -0.015em
  headline-lg:
    fontFamily: Poppins
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Poppins
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Poppins
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Google Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Google Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Google Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Google Sans Code
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Google Sans Code
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Google Sans Code
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
  numeric-countdown:
    fontFamily: Google Sans Code
    fontSize: 13px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
---

## Brand & Style

The design system establishes a warm, uplifting, and reassuring digital environment dedicated to preserving personal bonds and life milestones. It replaces the impersonal, bureaucratic feeling of standard calendar utilities with the warmth and emotional resonance of a personal celebration companion. 

### Brand Personality & Core Emotions
- **Warm & Empathetic:** The interface feels thoughtful and human, relying on soft organic tones, gentle surface layering, and approachable geometry rather than cold utilitarian minimalism.
- **Reliable & Vigilant:** Because missed birthdays strain real-world relationships, the system projects quiet competence, visual precision, and punctual clarity without inducing notification panic.
- **Celebratory & Joyful:** Joy is expressed through vibrant coral accents, radiant gradient spotlight cards, and celebratory micro-interactions, avoiding loud, cluttered novelty in favor of refined celebration.

### Design Movement & Aesthetic Approach
The design language combines **Warm Modernism** with **Tactile Soft Layering**. Crisp, milk-white operational cards sit above warm off-white canvas foundations (`#FAF9F6`), framed by hairline warm-gray borders (`#E8E6E1`). Tactile depth is communicated through soft, multi-tier diffuse shadows rather than heavy skeuomorphism, while pastel category indicators provide quick recognition across dense chronological feeds.

## Colors

The palette balances warm neutral backgrounds with high-energy coral brand touches and pastel categorical tagging. 

### Color Application Guidelines
- **Primary Brand Accent (`#FF6B4A`):** Reserved for primary interactive controls, "Add Birthday" triggers, active navigation items, countdown urgency badges, and spotlight gradients. Use `#FA5A36` for hover/active states.
- **Surface Foundations:** Primary app viewports rest on `surface-canvas` (`#FAF9F6`), with elevated operational panels and cards resting on `surface-card` (`#FFFFFF`). Never place pure white cards directly on pure white canvas; maintain clear separation via warm borders and subtle drop shadows.
- **Category Tagging:** Use category pills strictly with their coordinated tri-color tokens (background, border, text). This maintains WCAG AA contrast standards while keeping dashboard density readable.
- **Feedback & States:** Semantic status colors (`#10B981` emerald, `#F59E0B` amber, `#EF4444` crimson, `#3B82F6` sky blue) are reserved strictly for system delivery states, leap-year overrides, destructive flows, and channel indicators.

## Typography

The typographic system pairs the welcoming, humanist curves of Poppins for titles and headers with the clean legibility of Google Sans for reading text, and the structured precision of Google Sans Code for metadata, labels, and numeric readouts.

### Tabular Numerals & Time Rendering
- All countdown tokens, ages (`"Turning 30"`), time zone representations, calendar grid dates, and reminder intervals must use tabular figures (`font-variant-numeric: tabular-nums;` in Google Sans Code) to prevent layout shifts during live tick-overs or list re-sorting.
- Use `display-lg` sparingly, reserved for welcoming headers and the primary "Today's Birthdays" spotlight hero.
- Secondary descriptions, empty-state helpers, and gift notes use `body-md` in `text-secondary` (`#6E6D7A`).

## Layout & Spacing

The layout is built around an adaptive 12-column grid system on desktop that gracefully collapses into a single-column stacked view on mobile.

### Grid & Breakpoints
- **Desktop (>= 1024px):** Fixed 260px left-hand navigation sidebar paired with a 12-column fluid content canvas. Gutter is `1.5rem` (`24px`), max-width content container clamped at `1280px` with `margin` of `2rem` (`32px`).
- **Tablet (768px – 1023px):** Collapsible 72px icon-only rail or top app bar. 8-column layout with `1.25rem` gutters.
- **Mobile (< 768px):** Single-column vertical stream with `1rem` margins and `1rem` gutters. Primary navigation shifts to a fixed bottom navigation bar (height: 64px) accompanied by a floating action button (FAB) offset 16px above the bar.

### Spacing Rhythm
- **Internal Component Padding:** Chips and compact badges use `space-xs` vertically and `space-sm` horizontally. Interactive cards enforce `space-md` (`16px`) padding on mobile and `space-lg` (`24px`) on desktop.
- **Section Breaks:** Distinct grouping cards ("This Week", "Next 30 Days") are separated by `space-xl` (`32px`) to preserve visual breathing room.

## Elevation & Depth

Visual hierarchy is established using warm ambient shadows combined with crisp, low-opacity boundary outlines. Flat pure-white cards maintain separation from the off-white canvas through delicate warm-tinted shadow diffusion.

### Elevation Tiers
1. **Level 0 (Canvas):** Flat base surface (`#FAF9F6`). No shadow.
2. **Level 1 (Card & List Surface):** Used for chronological birthday feed items, settings blocks, and calendar cells.  
   - Shadow: `0px 1px 3px rgba(30, 30, 36, 0.04), 0px 4px 12px rgba(30, 30, 36, 0.03)`  
   - Border: `1px solid #E8E6E1`
3. **Level 2 (Dropdowns, Popovers & Hovered Cards):** Used for birthday card hover states, filter dropdowns, and date-cell preview cards.  
   - Shadow: `0px 4px 6px -1px rgba(30, 30, 36, 0.06), 0px 10px 24px -3px rgba(30, 30, 36, 0.08)`  
   - Transform: Translates `-1px` on the Y-axis.
4. **Level 3 (Modal Drawers & Dialogs):** Used for the "Add / Edit Birthday" dialog and destructive delete confirmations.  
   - Shadow: `0px 20px 25px -5px rgba(30, 30, 36, 0.1), 0px 8px 10px -6px rgba(30, 30, 36, 0.04)`  
   - Backdrop overlay: `rgba(30, 30, 36, 0.4)` with `backdrop-filter: blur(4px)`.
5. **Special Celebratory Spotlight:** Today's Birthday banner utilizes a dual inner ambient glow:  
   - Background: Linear gradient `135deg, #FFF5F2 0%, #FFFFFF 100%`  
   - Shadow: `0 4px 20px rgba(255, 107, 74, 0.08)`  
   - Border: `1px solid rgba(255, 107, 74, 0.2)`

## Shapes

The design system employs a refined rounded shape geometry (`Level 2`), conveying accessibility and friendliness while preserving operational density.

### Shape Application Matrix
- **Base Components (Inputs, Buttons, Cards):** Form controls and standard list item cards feature an outer corner radius of `0.5rem` (`8px`).
- **Interactive Containers (Modals, Spotlight Banners):** Larger surface dialogs and spotlight banners adopt `rounded-lg` (`1rem` / `16px`) to soften visual mass.
- **Pills & Status Badges:** Category tags (`Family`, `Friends`), offset reminder chips (`7d`, `1d`), countdown status badges (`"In 3 days"`), and avatar placeholders strictly use fully rounded pill shapes (`rounded-full` / `9999px`).
- **Checkboxes & Multi-select Toggles:** Checkboxes use a softened square shape (`0.25rem` / `4px`) for geometric distinction from pill-based filters.

## Components

### Buttons & Interactive Controls
- **Primary CTA:** Coral-amber fill (`#FF6B4A`), pure white text, medium weight Poppins, `8px` corner radius. On hover: `#FA5A36` with subtle scale (`1.01`). Focused: 3px outer ring tinted with `rgba(255, 107, 74, 0.35)`.
- **Secondary / Ghost Actions:** Crisp white background, `1px solid #E8E6E1`, text `#1E1E24`. Hover transitions to `#FDFBF7` with border `#D6D3CC`.
- **Celebratory Action Buttons ("Copy Wish", "Mark Wished"):** Elevated pill buttons with `coral-subtle` (`#FFF5F2`) background, coral text (`#FF6B4A`), and subtle border.

### Category Chips & Multi-Stage Reminder Selectors
- **Category Badges:** Rendered as pill chips with strict color pairing:
  - *Family:* `#FFE4E6` background, `#FECDD3` border, `#BE123C` text.
  - *Friends:* `#E0F2FE` background, `#BAE6FD` border, `#0369A1` text.
  - *Colleagues:* `#FEF3C7` background, `#FDE68A` border, `#B45309` text.
  - *Other:* `#F3E8FF` background, `#E9D5FF` border, `#6B21A8` text.
- **Reminder Offset Multi-Select:** Interactive toggle pills (`Same Day`, `1d`, `3d`, `7d`, `14d`). Unselected: `#FAF9F6` background, `#E8E6E1` border, `#6E6D7A` text. Selected: `#FF6B4A` background, pure white text, slight drop shadow.

### Birthday Contact Cards
- **Card Anatomy:** White background, `8px` radius, `1px solid #E8E6E1`. Left: Avatar initial ring tinted with category tone. Middle: Contact Name (`headline-sm`), category chip, turning age badge (`"Turning 29"` or `"Age hidden"`), and gift snippet preview with icon. Right: Tabular countdown indicator badge (`"Today"` in primary coral fill, or `"In 4 days"` in neutral soft pill) paired with contextual menu trigger.

### Today's Birthday Spotlight Banner
- Prominent container with soft gradient (`#FFF5F2` to `#FFFFFF`), soft coral hairline border (`rgba(255, 107, 74, 0.25)`), and confetti/sparkle icon micro-accent. Houses avatar, celebratory highlight typography, birthday notes ("Loves matcha & ceramic mugs"), and immediate action buttons.

### Form Inputs & Modal Dialogs
- **Inputs:** 40px height, warm background (`#FFFFFF`), `1px solid #E8E6E1`, `8px` radius. Floating or persistent labels in Google Sans Code label-md. Focus changes border to `#FF6B4A` with a 3px outer glow.
- **Duplicate Contact Warning Banner:** Non-blocking soft alert box featuring `#FEF3C7` background, `#B45309` text, and `#FDE68A` border, offering instant clarity when contacts share duplicate names.

### Monthly Calendar View
- 7-column layout with weekday header row in Google Sans Code label-sm uppercase. Days outside the current month use muted `#9CA3AF`. Days containing birthdays render mini avatar chips or colored category indicator dots below the date number, showing birthday count and tooltip previews on hover.