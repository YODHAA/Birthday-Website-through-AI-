# Product & Technical Specification: Birthday Reminder Application

## 1. Executive Summary
**Product Name:** Birthday Reminder (Working Title: *BDayPulse* / *KeepDate*)  
**Objective:** A responsive web and mobile-friendly application that enables users to manage personal and professional birthdays, configure multi-stage recurring notifications across time zones, track gift preferences, and never miss an important milestone.

---

## 2. User Roles & Authentication
* **Registered User:** Authenticated user who owns a private workspace of contacts, reminder schedules, and notification preferences.
* **Registration & Auth:** Email/Password and OAuth (Google Sign-In). Users must verify their email to enable email notifications. Upon onboarding, the system captures the user's default **IANA Time Zone** (e.g., `Asia/Kolkata`, `America/New_York`) and default daily reminder time (e.g., `09:00`).

---

## 3. Core Functional Requirements (Mapped to Acceptance Criteria)

### 3.1 Birthday Management (CRUD & Organization)
* **AC01 & AC02 — Add Birthday & Mandatory Fields:**
  * **Mandatory:** Contact Name (string, 1–100 chars), Birth Month (`1-12`), Birth Day (`1-31`).
  * **Optional:** Birth Year (integer, e.g., `1995` — supports year-omitted entries per Edge Case #7), Category (`Family`, `Friends`, `Colleagues`, `Other`), Notes / Gift Ideas (rich/plain text up to 1,000 chars), Contact Info (Email/Phone for quick wish actions), Avatar/Color tag.
* **AC03 — Edit Birthday:** Users can modify any field of an existing birthday record. Saving recalculates upcoming dates, age milestones, and re-syncs scheduled reminders.
* **AC04 — Delete Birthday:** Requires an explicit confirmation modal ("Are you sure you want to delete [Name]'s birthday? All scheduled reminders will be canceled."). Deleting immediately cancels pending reminder jobs (Edge Case #4).
* **AC05 & AC06 — View & Upcoming Birthdays:**
  * **Today's Birthdays Banner:** Highlights anyone celebrating today with a quick-action button (e.g., "Copy Wish" / "Send Greeting").
  * **Upcoming List:** Chronologically sorted by `days_until_next_birthday` (`0` to `365`), displaying countdown badges (e.g., *"Today"*, *"In 3 days"*, *"Oct 24"*).
* **AC07 — Age Calculation:**
  * If `birth_year` is provided: Automatically calculates current age and upcoming turning age (e.g., *"Turning 30"*).
  * If `birth_year` is omitted: Displays *"Age not specified"* without breaking age-based sorting or UI cards.
* **AC08 — Recurring Schedule:** All birthdays automatically recur annually without requiring user intervention.
* **AC09 — Duplicate Validation:**
  * When adding a record, check for existing entries with the exact same `name` (case-insensitive) AND `birth_month` + `birth_day`.
  * **Exact Match (Name + Date):** Block or require explicit override warning (*"A birthday for [Name] on [Date] already exists."*).
  * **Same Name, Different Date (Edge Case #6):** Display a non-blocking soft warning (*"You already have a contact named [Name] on [Other Date]. Save anyway?"*) to allow distinct individuals sharing a name.
* **AC10 — Search & Filtering:** Real-time instant search by name or gift notes, plus category filter chips (`All`, `Family`, `Friends`, `Colleagues`, `Other`) and view toggles (`List View` vs. `Monthly Calendar View`).

---

## 4. Reminder & Notification Engine

### 4.1 Configuration & Channels
* **AC11, AC12 & AC13 — Multi-Stage Reminders:**
  * Users can attach **multiple reminder offsets** per person: `Same day (0 days)`, `1 day before`, `3 days before`, `7 days before`, `14 days before`, or custom days.
  * Global default offsets can be set in User Settings and inherited by new birthdays (with per-contact override capability).
* **AC14 — Notification Time:** User selects a preferred delivery time (e.g., `09:00 AM`) in 15-minute increments.
* **AC15 — Notification Channels:** Supports **In-App / Web Push**, **Email**, and **SMS** (configurable per user; architecture uses a provider-agnostic dispatcher pattern).
* **AC16 — Time Zone Awareness:** All reminder triggers are computed in the user's configured IANA time zone and stored in UTC for scheduler execution.
* **AC17 — Delivery Tracking & Logs:** Every dispatched notification records a status (`PENDING`, `SENT`, `FAILED`, `RETRYING`, `CANCELED`) with timestamps and failure reason in a `notification_logs` table.
* **AC18 — Global & Per-Contact Toggle:** Master toggle to pause/enable all notifications, plus per-birthday mute toggle.

---

## 5. Edge Cases & Business Logic Rules

| # | Edge Case | System Behavior & Resolution Rule |
|---|---|---|
| **1** | **Feb 29 (Leap Year Birthday)** | In leap years, trigger on **Feb 29**. In non-leap years, user settings default to **Feb 28** (with a user-selectable preference for **Mar 1**). Age increments on the observed date. |
| **2** | **Midnight / Local Time Zone** | Reminders never fire at raw UTC `00:00` unless configured. Execution is strictly bound to `(target_date + user_preferred_time)` converted from `user.timezone` to UTC. |
| **3** | **User Changes Time Zone** | Updating `user.timezone` triggers an asynchronous background job that recalculates `next_trigger_at_utc` for all `PENDING` reminder schedules. |
| **4** | **Delete Birthday Post-Scheduling** | Deleting a birthday runs a transactional cascade: marks all `PENDING` reminders as `CANCELED` and removes queued jobs before deleting/soft-deleting the contact. |
| **5** | **Birthday Added for Today** | If a user adds a birthday for today's date: <br>• If `user_preferred_time` has **not yet passed** today -> schedule today's same-day reminder normally.<br>• If `user_preferred_time` **has already passed** today -> trigger an immediate "Today's Birthday" notification (if enabled) and schedule next year's recurrence. |
| **6** | **Duplicate Names, Different Dates** | Allowed. Soft confirmation prompt shown during creation; disambiguated in UI via category tags and birth dates. |
| **7** | **Missing Year of Birth** | `birth_year` is nullable. Date pickers allow toggling *"Include birth year"*. Age displays as `—` or `"Turning a year older"`. |
| **8** | **Notification Service Outage** | Failed deliveries enter an exponential backoff retry queue (e.g., retry at +5m, +15m, +1h, max 3 retries). Persistent failures log as `FAILED` and surface an in-app alert banner. |
| **9** | **Disabling Notifications Post-Scheduling** | Toggling off global or contact notifications immediately updates all `PENDING` reminders to `CANCELED` (or skips them at worker evaluation time). Re-enabling regenerates future schedules. |

---

## 6. Data Model (Relational Schema)

### `users`
* `id` (UUID, PK)
* `email` (VARCHAR, Unique, Not Null)
* `name` (VARCHAR, Not Null)
* `timezone` (VARCHAR, Default `'UTC'`)
* `default_reminder_time` (TIME, Default `'09:00:00'`)
* `default_offsets` (JSONB, e.g., `[0, 1, 7]`)
* `leap_year_rule` (ENUM: `'FEB_28'`, `'MAR_1'`, Default `'FEB_28'`)
* `notifications_enabled` (BOOLEAN, Default `true`)
* `channels_enabled` (JSONB, e.g., `{"push": true, "email": true, "sms": false}`)
* `created_at`, `updated_at` (TIMESTAMP)

### `birthdays`
* `id` (UUID, PK)
* `user_id` (UUID, FK -> `users.id`, Indexed)
* `name` (VARCHAR(100), Not Null)
* `birth_month` (SMALLINT, 1–12, Not Null)
* `birth_day` (SMALLINT, 1–31, Not Null)
* `birth_year` (SMALLINT, Nullable)
* `category` (ENUM: `'FAMILY'`, `'FRIENDS'`, `'COLLEAGUES'`, `'OTHER'`, Default `'FRIENDS'`)
* `notes` (TEXT, Nullable — gift ideas, preferences)
* `reminder_offsets` (JSONB, Nullable — overrides user defaults if set)
* `is_muted` (BOOLEAN, Default `false`)
* `created_at`, `updated_at` (TIMESTAMP)

### `reminder_schedules`
* `id` (UUID, PK)
* `birthday_id` (UUID, FK -> `birthdays.id` ON DELETE CASCADE)
* `user_id` (UUID, FK -> `users.id`)
* `offset_days` (SMALLINT — `0`, `1`, `3`, `7`, `14`)
* `channel` (ENUM: `'PUSH'`, `'EMAIL'`, `'SMS'`)
* `scheduled_for_utc` (TIMESTAMP WITH TIME ZONE, Indexed)
* `status` (ENUM: `'PENDING'`, `'SENT'`, `'FAILED'`, `'CANCELED'`)
* `retry_count` (SMALLINT, Default `0`)
* `last_error` (TEXT, Nullable)

---

## 7. Non-Functional Requirements (NFRs)
* **Performance:** Initial dashboard & birthday list load `< 2.0s` (p95) via indexed queries on `(user_id, birth_month, birth_day)` and client-side caching.
* **Security & Privacy:** Row-Level Security (RLS) / strict user-ID scoping on all API endpoints; HTTPS/TLS in transit; encrypted database storage at rest; no sharing or third-party monetization of contact dates.
* **Reliability & Availability:** 99.9% scheduler uptime; idempotency keys (`birthday_id + year + offset_days + channel`) prevent duplicate notifications on worker restarts.
* **Backup:** Automated daily point-in-time database snapshots with 30-day retention, plus user-accessible CSV/JSON export & import.
