# Google Stitch Prompt — Birthday Reminder App UI/UX Prototype

Copy and paste the prompt below into **Google Stitch** to generate the complete, responsive multi-screen UI prototype ready for export to Google AI Studio.

---

## Prompt for Stitch

```text
Design a modern, warm, and highly intuitive web and mobile-responsive application called "Birthday Reminder" for tracking personal and professional birthdays, gift ideas, and multi-stage reminders.

### Visual Aesthetic & Design System
- **Theme:** Clean, uplifting, modern productivity aesthetic with a soft warm off-white background (#FAF9F6), crisp white cards (#FFFFFF), subtle warm borders (#E8E6E1), and deep charcoal typography (#1E1E24).
- **Accent Palette:** Vibrant coral-amber primary brand color (#FF6B4A) for primary CTAs and today's highlights, paired with soft pastel category pills:
  - Family: Soft Rose (#FFE4E6 text #BE123C)
  - Friends: Soft Sky Blue (#E0F2FE text #0369A1)
  - Colleagues: Soft Amber (#FEF3C7 text #B45309)
  - Other: Soft Lavender (#F3E8FF text #6B21A8)
- **Typography:** Clean geometric sans-serif (Plus Jakarta Sans or Inter) with tabular numerals for countdowns, dates, and ages.
- **Responsiveness:** Desktop layout with a sleek left navigation sidebar (Dashboard, Calendar, All Birthdays, Notification Logs, Settings) and mobile layout with a bottom navigation bar and floating "+" action button.

### Screens & Components to Generate

1. **Main Dashboard & Upcoming Birthdays View (Primary Screen):**
   - **Top Header:** Greeting ("Good morning, Alex"), quick search bar ("Search by name or gift idea..."), time zone badge ("IST • UTC+5:30"), and a prominent "+ Add Birthday" button.
   - **Today's Birthdays Spotlight Banner:** A celebratory gradient card highlighting people whose birthday is today (e.g., "Maya Lin • Turning 29 today!"), displaying her gift note ("Loves matcha & ceramic mugs") and quick action buttons ("Copy Wish", "Mark Wished").
   - **Filter & View Bar:** Category filter chips (All, Family, Friends, Colleagues, Other) and a segmented toggle switching between "Upcoming List" and "Monthly Calendar".
   - **Upcoming Birthdays Chronological Feed:** Clean horizontal cards grouped by timeframe ("This Week", "Next 30 Days", "Later This Year"). Each card displays:
     - Avatar initials/photo, Full Name, Category badge
     - Formatted birth date (e.g., "Nov 18, 1997") and calculated age badge ("Turning 29") — plus an example card without a birth year showing ("Dec 04 • Age hidden")
     - Active reminder bell chips showing configured offsets (e.g., "7d, 1d, Same day")
     - Countdown pill on the right ("In 4 days") and a three-dot menu (Edit, Mute Reminders, Delete).

2. **Add / Edit Birthday Modal (Slide-over Drawer or Centered Dialog):**
   - **Fields:**
     - Full Name (required input with validation state)
     - Birth Month & Day selector (required) + a toggle switch for "Include Birth Year" (reveals Year dropdown when active; supports month/day-only birthdays when off)
     - Category selector pills (Family, Friends, Colleagues, Other)
     - Gift Ideas & Notes textarea (placeholder: "Clothing sizes, favorite coffee, gift links...")
     - **Multi-Reminder Selector:** Interactive multi-select pills for reminder timing: [Same Day], [1 Day Before], [3 Days Before], [7 Days Before], [14 Days Before]
     - Channel toggles (Push, Email, SMS)
   - **Validation Preview:** Show a subtle inline warning banner example for duplicate detection ("Note: You already have a contact named 'Rohan' on March 12").

3. **Monthly Calendar View:**
   - Clean 7-column monthly calendar grid with month navigation (< November 2026 >) and a "Today" jump button.
   - Dates with birthdays show colored avatar chips/dots directly inside the day cell (e.g., "14 — Maya Lin (29)").
   - Clicking a date highlights the day and opens a side panel showing all birthdays on that date and their gift notes.

4. **Notification Preferences & Edge-Case Settings Screen:**
   - Master "Enable Birthday Reminders" toggle switch.
   - Preferred Daily Notification Time picker (e.g., "09:00 AM") and IANA Time Zone dropdown selector.
   - Default Reminder Offsets multi-select checkboxes (Same day, 1d, 3d, 7d, 14d).
   - Notification Channels configuration cards (Web Push, Email, SMS) with status badges.
   - **Leap Year (Feb 29) Preference:** Radio selector choosing between "Remind on Feb 28 in non-leap years" or "Remind on March 1 in non-leap years".
   - **Recent Notification Delivery Log Table:** Compact status table showing Contact Name, Channel, Scheduled Time, and Delivery Status pills (Sent, Pending, Failed with Retry button).

5. **Delete Confirmation Dialog & Empty State:**
   - Clean confirmation modal warning that deleting a birthday permanently cancels all scheduled reminders.
```
