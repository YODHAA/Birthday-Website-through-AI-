import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BirthdayService } from '../services/birthday';

@Component({
  selector: 'app-settings',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="space-y-6 pb-20 lg:pb-8">
      <div class="bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-xs">
        <h2 class="text-2xl font-bold text-[#1E1E24]">Preferences & Settings</h2>
        <p class="text-sm text-[#6E6D7A]">Configure your default notification schedules, time zone, and account backup.</p>
      </div>

      <!-- Settings Form Card -->
      <div class="bg-white border border-[#E8E6E1] rounded-2xl p-6 shadow-xs space-y-6">
        <form [formGroup]="form" (ngSubmit)="saveSettings()" class="space-y-5">
          <!-- Master Notification Toggle -->
          <div class="flex items-center justify-between p-4 bg-[#FAF9F6] rounded-xl border border-[#E8E6E1]">
            <div>
              <span class="font-bold text-[#1E1E24] block">Enable Birthday Reminders</span>
              <span class="text-xs text-[#6E6D7A]">Master toggle for all scheduled alerts and notifications.</span>
            </div>
            <input type="checkbox" id="notifToggle" formControlName="notificationsEnabled" class="w-5 h-5 accent-[#FF6B4A] rounded cursor-pointer"/>
          </div>

          <!-- User Name & Email -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="userName" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Your Name</label>
              <input id="userName" type="text" formControlName="name" class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]"/>
            </div>
            <div>
              <label for="userEmail" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Email Address</label>
              <input id="userEmail" type="email" formControlName="email" class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]"/>
            </div>
          </div>

          <!-- Timezone & Preferred Time -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="userTz" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">IANA Time Zone</label>
              <select id="userTz" formControlName="timezone" class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]">
                <option value="UTC">UTC (Coordinated Universal Time)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
              </select>
            </div>

            <div>
              <label for="userTime" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Preferred Notification Time</label>
              <input id="userTime" type="time" formControlName="defaultReminderTime" class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]"/>
            </div>
          </div>

          <!-- Leap Year Rule -->
          <div>
            <label for="leapRule" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Leap Year (Feb 29) Rule</label>
            <select id="leapRule" formControlName="leapYearRule" class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]">
              <option value="FEB_28">Remind on Feb 28 in non-leap years</option>
              <option value="MAR_1">Remind on March 1 in non-leap years</option>
            </select>
          </div>

          <div class="flex justify-end pt-4">
            <button type="submit" class="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#FF6B4A] hover:bg-[#FA5A36] text-white shadow-md shadow-[#FF6B4A]/20 transition-all">
              Save Preferences
            </button>
          </div>
        </form>
      </div>

      <!-- Backup & Data Export / Import Card -->
      <div class="bg-white border border-[#E8E6E1] rounded-2xl p-6 shadow-xs space-y-4">
        <h3 class="font-bold text-lg text-[#1E1E24]">Backup & Data Recovery</h3>
        <p class="text-sm text-[#6E6D7A]">Export all your birthdays and settings as a JSON backup file, or restore from a previous backup.</p>

        <div class="flex flex-wrap items-center gap-4 pt-2">
          <button 
            (click)="birthdayService.exportData()"
            class="flex items-center gap-2 bg-[#FAF9F6] hover:bg-[#E8E6E1]/50 border border-[#E8E6E1] text-[#1E1E24] font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors">
            <mat-icon class="text-sm text-[#FF6B4A]">download</mat-icon>
            <span>Export JSON Backup</span>
          </button>

          <label class="flex items-center gap-2 bg-[#FAF9F6] hover:bg-[#E8E6E1]/50 border border-[#E8E6E1] text-[#1E1E24] font-semibold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer">
            <mat-icon class="text-sm text-[#FF6B4A]">upload</mat-icon>
            <span>Import Backup</span>
            <input type="file" accept=".json" (change)="onFileSelected($event)" class="hidden"/>
          </label>
        </div>
      </div>
    </div>
  `
})
export class Settings {
  private fb = inject(FormBuilder);
  readonly birthdayService = inject(BirthdayService);

  readonly form: FormGroup = this.fb.group({
    name: ['Alex Morgan', [Validators.required]],
    email: ['alex.morgan@example.com', [Validators.required, Validators.email]],
    timezone: ['UTC', [Validators.required]],
    defaultReminderTime: ['09:00', [Validators.required]],
    leapYearRule: ['FEB_28', [Validators.required]],
    notificationsEnabled: [true]
  });

  constructor() {
    const usr = this.birthdayService.user();
    if (usr) {
      this.form.patchValue({
        name: usr.name,
        email: usr.email,
        timezone: usr.timezone,
        defaultReminderTime: usr.defaultReminderTime,
        leapYearRule: usr.leapYearRule,
        notificationsEnabled: usr.notificationsEnabled
      });
    }
  }

  async saveSettings() {
    if (this.form.invalid) return;
    await this.birthdayService.updateUser(this.form.value);
    alert('Preferences saved successfully!');
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input || !input.files || input.files.length === 0) return;
    const file = input.files[0];
    const text = await file.text();
    const success = await this.birthdayService.importData(text);
    if (success) {
      alert('Data imported successfully!');
    } else {
      alert('Failed to import backup file.');
    }
  }
}
