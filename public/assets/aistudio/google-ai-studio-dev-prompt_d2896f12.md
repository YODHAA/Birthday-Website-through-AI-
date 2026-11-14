# Google AI Studio Prompt — Full-Stack Birthday Reminder App Development

Use this prompt in **Google AI Studio** after exporting your UI prototype from **Google Stitch** to wire up full state management, recurring date logic, time-zone-aware scheduling, duplicate validation, and edge-case handling.

---

## Prompt for Google AI Studio

```text
Build a complete, production-ready Birthday Reminder web application using the imported Google Stitch UI design. Implement full interactive functionality, persistent storage, client-side state management, time-zone-aware age/countdown calculations, and a simulated/integrated notification scheduler that satisfies all functional, UX, and edge-case requirements below.

### 1. Tech Stack & Architecture
- **Frontend:** React (TypeScript), Tailwind CSS, Lucide Icons.
- **State & Persistence:** Use structured local storage / IndexedDB (with clean service-layer abstractions ready for Supabase/Firebase backend integration) plus JSON/CSV export & import for backup and recovery.
- **Date & Time Engine:** Use `Intl.DateTimeFormat` and clean date utilities (e.g., `date-fns` / `luxon`) with full IANA time zone support.

### 2. Core Functional Requirements to Implement
1. **Authentication & Onboarding State:**
   - Support user profile setup (Name, Email, Time Zone auto-detected via `Intl.DateTimeFormat().resolvedOptions().timeZone`, Preferred Reminder Time defaulting to `09:00`).
2. **Birthday CRUD & Validation (AC01–AC10):**
   - **Add & Edit:** Mandatory `name` and `birthMonth` + `birthDay`. Optional `birthYear` (controlled by an "Include birth year" toggle), `category` (`Family`, `Friends`, `Colleagues`, `Other`), `notes` (gift preferences), `reminderOffsets` array, and `muted` flag.
   - **Delete Confirmation:** Clicking delete must open a confirmation modal. Confirming removes the birthday and immediately cancels all `PENDING` reminder schedules for that contact.
   - **Duplicate Validation (AC09 & Edge Case #6):**
     - Prevent exact duplicate entries (same normalized name + same month & day) with a clear error message.
     - If the name matches an existing contact but the birth date is different, display a confirmation warning ("You already have a contact named [Name] on [Date]. Add anyway?") allowing the user to proceed.
   - **Automatic Age & Countdown Calculation (AC06 & AC07):**
     - Sort upcoming birthdays chronologically by days remaining from "Today" in the user's configured time zone (`0` days = Today, `1` day = Tomorrow, etc.).
     - If `birthYear` is present, display both current age and upcoming age (e.g., "Turning 30"). If omitted, display "Age not specified".
   - **Search & Filtering (AC10):**
     - Instant search filtering by contact name or gift notes, combined with category filter pills and a toggle between **Upcoming List View** and **Monthly Calendar View**.

### 3. Multi-Stage Reminders & Notification Scheduler (AC11–AC18)
1. **Configurable Reminders:**
   - Support multiple reminder offsets per birthday: `0` (Same day), `1`, `3`, `7`, and `14` days before.
   - Support preferred notification time (e.g., `09:00`) and channels (`Push`, `Email`, `SMS`).
2. **Scheduler & Delivery Log Engine:**
   - Automatically generate concrete `ReminderSchedule` items for each active birthday based on its offsets, the user's preferred time, and the user's time zone.
   - Include a **"Simulate Scheduler Tick / Test Notification"** control in the Notification Logs tab so I can test firing due reminders, see browser notifications / in-app toasts, and inspect delivery statuses (`PENDING`, `SENT`, `FAILED`, `CANCELED`).
   - Implement a retry mechanism for `FAILED` notifications (with a simulated failure toggle to test retries and error logging).
   - Respect the global **"Enable Birthday Reminders"** master toggle and per-birthday mute toggles.

### 4. Critical Edge Cases (Must Implement & Handle Cleanly)
1. **Feb 29 (Leap Year Birthdays):**
   - Include a user setting: *"For Feb 29 birthdays in non-leap years, remind me on:"* with options `Feb 28` (default) or `March 1`. Calculate upcoming countdowns, calendar placement, and reminder triggers using this rule.
2. **Local Time Zone & Midnight Accuracy:**
   - Calculate "Today", days until birthday, and reminder trigger timestamps strictly in the user's selected IANA time zone—never raw UTC midnight.
3. **User Changes Time Zone:**
   - When the user changes their time zone in Settings, automatically recalculate all `PENDING` reminder timestamps and refresh upcoming countdowns immediately.
4. **Birthday Added for Today's Date:**
   - When a user adds a birthday matching today's month/day:
     - If the user's preferred notification time has **not yet passed** today, schedule today's same-day reminder for that time.
     - If the preferred notification time **has already passed** today, immediately trigger an in-app/push "Today's Birthday" alert (if notifications are enabled) and schedule next year's recurring reminder.
5. **Pre-loaded Realistic Seed Data:**
   - Seed the initial state with 6–8 realistic sample birthdays covering all edge cases: one birthday **today**, one **in 3 days**, one **Feb 29 leap-year birthday**, one **without a birth year**, and contacts across Family, Friends, and Colleagues with gift notes.
```
