import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BirthdayService } from '../services/birthday';

@Component({
  selector: 'app-notifications-log',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 pb-20 lg:pb-8">
      <!-- Header & Simulator CTA -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-xs">
        <div>
          <h2 class="text-2xl font-bold text-[#1E1E24]">Notification Logs & Dispatcher</h2>
          <p class="text-sm text-[#6E6D7A]">Monitor scheduled reminders, delivery statuses, and test scheduler execution.</p>
        </div>

        <button 
          (click)="simulateTick()"
          class="flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#FA5A36] text-white font-medium py-2.5 px-5 rounded-xl shadow-md shadow-[#FF6B4A]/20 transition-all text-xs">
          <mat-icon>bolt</mat-icon>
          <span>Simulate Scheduler Tick</span>
        </button>
      </div>

      <!-- Logs Table Card -->
      <div class="bg-white border border-[#E8E6E1] rounded-2xl shadow-xs overflow-hidden">
        <div class="p-6 border-b border-[#E8E6E1] flex items-center justify-between">
          <h3 class="font-bold text-lg text-[#1E1E24]">Recent Delivery History</h3>
          <span class="text-xs text-[#6E6D7A] font-mono-tabular">{{ birthdayService.logs().length }} entries recorded</span>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-[#FAF9F6] border-b border-[#E8E6E1] text-[11px] font-bold text-[#6E6D7A] uppercase tracking-wider">
                <th class="py-3 px-6">Contact / Event</th>
                <th class="py-3 px-6">Channel</th>
                <th class="py-3 px-6">Scheduled / Timestamp</th>
                <th class="py-3 px-6">Status</th>
                <th class="py-3 px-6">Details</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#E8E6E1] text-sm text-[#1E1E24]">
              @if (birthdayService.logs().length === 0) {
                <tr>
                  <td colspan="5" class="py-12 text-center text-[#6E6D7A]">
                    No notification logs recorded yet. Click "Simulate Scheduler Tick" to test.
                  </td>
                </tr>
              } @else {
                @for (log of birthdayService.logs(); track log.id) {
                  <tr class="hover:bg-[#FAF9F6]/50 transition-colors">
                    <td class="py-4 px-6 font-semibold">{{ log.birthdayName }}</td>
                    <td class="py-4 px-6">
                      <span class="px-2 py-1 rounded-md text-xs font-semibold bg-[#FAF9F6] border border-[#E8E6E1]">
                        {{ log.channel }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-xs text-[#6E6D7A] font-mono-tabular">
                      {{ log.scheduledTime | date:'medium' }}
                    </td>
                    <td class="py-4 px-6">
                      <span [class]="'px-2.5 py-1 rounded-full text-xs font-bold ' + getStatusClass(log.status)">
                        {{ log.status }}
                      </span>
                    </td>
                    <td class="py-4 px-6 text-xs text-[#6E6D7A] max-w-xs truncate">
                      {{ log.message }}
                    </td>
                  </tr>
                }
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `
})
export class NotificationsLog {
  readonly birthdayService = inject(BirthdayService);

  async simulateTick() {
    await this.birthdayService.simulateTick();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'SENT':
        return 'bg-[#DCFCE7] text-[#166534]';
      case 'PENDING':
        return 'bg-[#FEF3C7] text-[#B45309]';
      case 'FAILED':
        return 'bg-[#FFDAD6] text-[#93000A]';
      default:
        return 'bg-[#FAF9F6] text-[#6E6D7A]';
    }
  }
}
