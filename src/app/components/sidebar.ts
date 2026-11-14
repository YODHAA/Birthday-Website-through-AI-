import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BirthdayService } from '../services/birthday';

@Component({
  selector: 'app-sidebar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <!-- Desktop Sidebar -->
    <aside class="hidden lg:flex flex-col w-64 bg-white border-r border-[#E8E6E1] h-screen sticky top-0 shrink-0">
      <!-- Brand Header -->
      <div class="flex items-center gap-3 px-6 py-6 border-b border-[#E8E6E1]">
        <div class="w-10 h-10 rounded-xl bg-[#FF6B4A] flex items-center justify-center text-white shadow-md shadow-[#FF6B4A]/20">
          <mat-icon class="text-2xl">cake</mat-icon>
        </div>
        <div>
          <h1 class="font-bold text-lg text-[#1E1E24] tracking-tight">KeepDate</h1>
          <p class="text-xs text-[#6E6D7A]">Birthday & Gift Keepsake</p>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <button 
          (click)="setTab('dashboard')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left"
          [class.bg-[#FF6B4A]]="birthdayService.activeTab() === 'dashboard'"
          [class.text-white]="birthdayService.activeTab() === 'dashboard'"
          [class.shadow-sm]="birthdayService.activeTab() === 'dashboard'"
          [class.text-[#1E1E24]]="birthdayService.activeTab() !== 'dashboard'"
          [class.hover:bg-[#FAF9F6]]="birthdayService.activeTab() !== 'dashboard'">
          <mat-icon>dashboard</mat-icon>
          <span>Dashboard & Feed</span>
        </button>

        <button 
          (click)="setTab('calendar')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left"
          [class.bg-[#FF6B4A]]="birthdayService.activeTab() === 'calendar'"
          [class.text-white]="birthdayService.activeTab() === 'calendar'"
          [class.shadow-sm]="birthdayService.activeTab() === 'calendar'"
          [class.text-[#1E1E24]]="birthdayService.activeTab() !== 'calendar'"
          [class.hover:bg-[#FAF9F6]]="birthdayService.activeTab() !== 'calendar'">
          <mat-icon>calendar_month</mat-icon>
          <span>Monthly Calendar</span>
        </button>

        <button 
          (click)="setTab('notifications')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left"
          [class.bg-[#FF6B4A]]="birthdayService.activeTab() === 'notifications'"
          [class.text-white]="birthdayService.activeTab() === 'notifications'"
          [class.shadow-sm]="birthdayService.activeTab() === 'notifications'"
          [class.text-[#1E1E24]]="birthdayService.activeTab() !== 'notifications'"
          [class.hover:bg-[#FAF9F6]]="birthdayService.activeTab() !== 'notifications'">
          <mat-icon>notifications_active</mat-icon>
          <span>Notification Logs</span>
        </button>

        <button 
          (click)="setTab('settings')"
          class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-colors text-left"
          [class.bg-[#FF6B4A]]="birthdayService.activeTab() === 'settings'"
          [class.text-white]="birthdayService.activeTab() === 'settings'"
          [class.shadow-sm]="birthdayService.activeTab() === 'settings'"
          [class.text-[#1E1E24]]="birthdayService.activeTab() !== 'settings'"
          [class.hover:bg-[#FAF9F6]]="birthdayService.activeTab() !== 'settings'">
          <mat-icon>settings</mat-icon>
          <span>Preferences & Export</span>
        </button>
      </nav>

      <!-- Quick Add CTA in Sidebar -->
      <div class="p-4 border-t border-[#E8E6E1]">
        <button 
          (click)="openAddModal.emit()"
          class="w-full flex items-center justify-center gap-2 bg-[#FF6B4A] hover:bg-[#FA5A36] text-white font-medium py-3 px-4 rounded-xl shadow-md shadow-[#FF6B4A]/20 transition-all text-sm">
          <mat-icon>add</mat-icon>
          <span>Add Birthday</span>
        </button>
      </div>

      <!-- User Profile Footer -->
      @if (birthdayService.user(); as usr) {
        <div class="p-4 border-t border-[#E8E6E1] flex items-center gap-3 bg-[#FAF9F6]">
          <div class="w-9 h-9 rounded-full bg-[#E0F2FE] text-[#0369A1] font-bold flex items-center justify-center text-sm">
            {{ usr.name.charAt(0) }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-[#1E1E24] truncate">{{ usr.name }}</p>
            <p class="text-xs text-[#6E6D7A] truncate">{{ usr.timezone }}</p>
          </div>
        </div>
      }
    </aside>

    <!-- Mobile Header -->
    <header class="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E8E6E1] sticky top-0 z-30">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-[#FF6B4A] flex items-center justify-center text-white shadow-sm">
          <mat-icon class="text-xl">cake</mat-icon>
        </div>
        <span class="font-bold text-[#1E1E24]">KeepDate</span>
      </div>
      <button 
        (click)="openAddModal.emit()"
        class="bg-[#FF6B4A] text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 shadow-sm">
        <mat-icon class="text-sm">add</mat-icon>
        <span>Add</span>
      </button>
    </header>

    <!-- Mobile Bottom Navigation -->
    <nav class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8E6E1] flex items-center justify-around py-2 z-30 shadow-lg">
      <button 
        (click)="setTab('dashboard')"
        class="flex flex-col items-center py-1 px-3"
        [class.text-[#FF6B4A]]="birthdayService.activeTab() === 'dashboard'"
        [class.text-[#6E6D7A]]="birthdayService.activeTab() !== 'dashboard'">
        <mat-icon class="text-xl">dashboard</mat-icon>
        <span class="text-[10px] font-medium mt-0.5">Feed</span>
      </button>

      <button 
        (click)="setTab('calendar')"
        class="flex flex-col items-center py-1 px-3"
        [class.text-[#FF6B4A]]="birthdayService.activeTab() === 'calendar'"
        [class.text-[#6E6D7A]]="birthdayService.activeTab() !== 'calendar'">
        <mat-icon class="text-xl">calendar_month</mat-icon>
        <span class="text-[10px] font-medium mt-0.5">Calendar</span>
      </button>

      <button 
        (click)="setTab('notifications')"
        class="flex flex-col items-center py-1 px-3"
        [class.text-[#FF6B4A]]="birthdayService.activeTab() === 'notifications'"
        [class.text-[#6E6D7A]]="birthdayService.activeTab() !== 'notifications'">
        <mat-icon class="text-xl">notifications_active</mat-icon>
        <span class="text-[10px] font-medium mt-0.5">Logs</span>
      </button>

      <button 
        (click)="setTab('settings')"
        class="flex flex-col items-center py-1 px-3"
        [class.text-[#FF6B4A]]="birthdayService.activeTab() === 'settings'"
        [class.text-[#6E6D7A]]="birthdayService.activeTab() !== 'settings'">
        <mat-icon class="text-xl">settings</mat-icon>
        <span class="text-[10px] font-medium mt-0.5">Settings</span>
      </button>
    </nav>
  `
})
export class Sidebar {
  readonly birthdayService = inject(BirthdayService);
  readonly openAddModal = output<void>();

  setTab(tab: 'dashboard' | 'calendar' | 'notifications' | 'settings') {
    this.birthdayService.activeTab.set(tab);
  }
}
