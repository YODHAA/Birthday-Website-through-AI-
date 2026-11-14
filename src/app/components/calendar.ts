import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BirthdayService } from '../services/birthday';
import { Birthday } from '../models/birthday';
import { calculateAge, getCategoryStyles } from '../utils/date-utils';

@Component({
  selector: 'app-calendar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 pb-20 lg:pb-8">
      <!-- Calendar Header Controls -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-xs">
        <div>
          <h2 class="text-2xl font-bold text-[#1E1E24]">Monthly Calendar</h2>
          <p class="text-sm text-[#6E6D7A]">View birthdays distributed across the calendar grid.</p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            (click)="goToToday()"
            class="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF9F6] border border-[#E8E6E1] text-[#1E1E24] hover:bg-[#E8E6E1]/50 transition-colors">
            Today
          </button>
          
          <div class="flex items-center gap-1 bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl p-1">
            <button (click)="prevMonth()" class="p-2 hover:bg-white rounded-lg transition-colors text-[#1E1E24]">
              <mat-icon class="text-lg">chevron_left</mat-icon>
            </button>
            <span class="px-4 text-sm font-bold text-[#1E1E24] min-w-[140px] text-center">
              {{ monthNames[currentMonth()] }} {{ currentYear() }}
            </span>
            <button (click)="nextMonth()" class="p-2 hover:bg-white rounded-lg transition-colors text-[#1E1E24]">
              <mat-icon class="text-lg">chevron_right</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Main Grid & Side Panel Layout -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Calendar Grid (2 columns on desktop) -->
        <div class="lg:col-span-2 bg-white border border-[#E8E6E1] rounded-2xl p-6 shadow-xs">
          <!-- Weekday Headers -->
          <div class="grid grid-cols-7 gap-2 mb-4 text-center">
            @for (day of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; track day) {
              <div class="text-xs font-bold text-[#6E6D7A] uppercase tracking-wider">{{ day }}</div>
            }
          </div>

          <!-- Days Grid -->
          <div class="grid grid-cols-7 gap-2">
            @for (cell of calendarCells(); track $index) {
              @if (cell.dayNumber !== null) {
                <div 
                  role="button"
                  tabindex="0"
                  (click)="selectDate(cell.dayNumber)"
                  (keydown.enter)="selectDate(cell.dayNumber)"
                  class="min-h-[90px] p-2 rounded-xl border border-[#E8E6E1] flex flex-col justify-between cursor-pointer transition-all hover:border-[#FF6B4A] focus:outline-none focus:ring-2 focus:ring-[#FF6B4A]"
                  [class.bg-[#FFF5F2]]="isTodayCell(cell.dayNumber)"
                  [class.border-[#FF6B4A]]="isTodayCell(cell.dayNumber)"
                  [class.bg-white]="!isTodayCell(cell.dayNumber)"
                  [class.ring-2]="selectedDay() === cell.dayNumber"
                  [class.ring-[#FF6B4A]]="selectedDay() === cell.dayNumber">
                  
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-bold font-mono-tabular" [class.text-[#FF6B4A]]="isTodayCell(cell.dayNumber)" [class.text-[#1E1E24]]="!isTodayCell(cell.dayNumber)">
                      {{ cell.dayNumber }}
                    </span>
                    @if (cell.birthdays.length > 0) {
                      <span class="w-5 h-5 rounded-full bg-[#FF6B4A] text-white text-[10px] font-bold flex items-center justify-center">
                        {{ cell.birthdays.length }}
                      </span>
                    }
                  </div>

                  <div class="space-y-1 mt-1 overflow-hidden">
                    @for (b of cell.birthdays.slice(0, 2); track b.id) {
                      <div class="text-[10px] font-medium truncate px-1.5 py-0.5 rounded bg-[#FAF9F6] border border-[#E8E6E1] text-[#1E1E24]">
                        {{ b.name }}
                      </div>
                    }
                    @if (cell.birthdays.length > 2) {
                      <div class="text-[9px] text-[#6E6D7A] font-semibold text-center">
                        +{{ cell.birthdays.length - 2 }} more
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="min-h-[90px] p-2 rounded-xl bg-[#FAF9F6]/40 border border-transparent"></div>
              }
            }
          </div>
        </div>

        <!-- Selected Date Details Side Panel -->
        <div class="bg-white border border-[#E8E6E1] rounded-2xl p-6 shadow-xs flex flex-col">
          <div class="flex items-center justify-between pb-4 border-b border-[#E8E6E1] mb-4">
            <div>
              <h3 class="font-bold text-lg text-[#1E1E24]">
                {{ selectedDay() ? monthNames[currentMonth()] + ' ' + selectedDay() + ', ' + currentYear() : 'Select a Day' }}
              </h3>
              <p class="text-xs text-[#6E6D7A]">
                {{ selectedDayBirthdays().length }} birthday(s) on this date
              </p>
            </div>
            <mat-icon class="text-[#FF6B4A]">event</mat-icon>
          </div>

          <div class="flex-1 overflow-y-auto space-y-4">
            @if (selectedDayBirthdays().length === 0) {
              <div class="py-12 text-center text-[#6E6D7A]">
                <mat-icon class="text-4xl mb-2">event_available</mat-icon>
                <p class="text-sm">No birthdays scheduled for this date. Click any date on the calendar to inspect.</p>
              </div>
            } @else {
              @for (b of selectedDayBirthdays(); track b.id) {
                <div class="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1] space-y-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-[#1E1E24]">{{ b.name }}</span>
                    <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-semibold ' + getCategoryColor(b.category).bg + ' ' + getCategoryColor(b.category).text">
                      {{ b.category }}
                    </span>
                  </div>

                  <p class="text-xs text-[#6E6D7A]">
                    @let ageInfo = getAge(b);
                    @if (ageInfo.turningAge !== null) {
                      Turning {{ ageInfo.turningAge }}
                    } @else {
                      Age not specified
                    }
                  </p>

                  @if (b.notes) {
                    <p class="text-xs text-[#1E1E24] pt-2 border-t border-[#E8E6E1]">
                      <span class="font-semibold">Gift Note:</span> {{ b.notes }}
                    </p>
                  }
                </div>
              }
            }
          </div>
        </div>
      </div>
    </div>
  `
})
export class Calendar {
  readonly birthdayService = inject(BirthdayService);

  readonly monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  readonly currentMonth = signal<number>(new Date().getMonth());
  readonly currentYear = signal<number>(new Date().getFullYear());
  readonly selectedDay = signal<number | null>(new Date().getDate());

  readonly calendarCells = computed(() => {
    const month = this.currentMonth();
    const year = this.currentYear();
    
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const cells: { dayNumber: number | null; birthdays: Birthday[] }[] = [];
    
    for (let i = 0; i < firstDayIndex; i++) {
      cells.push({ dayNumber: null, birthdays: [] });
    }
    
    const birthdays = this.birthdayService.birthdays();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const matchBdays = birthdays.filter(b => b.birthMonth === month + 1 && b.birthDay === day);
      cells.push({ dayNumber: day, birthdays: matchBdays });
    }
    
    return cells;
  });

  readonly selectedDayBirthdays = computed(() => {
    const day = this.selectedDay();
    if (!day) return [];
    const month = this.currentMonth() + 1;
    return this.birthdayService.birthdays().filter(b => b.birthMonth === month && b.birthDay === day);
  });

  prevMonth() {
    let m = this.currentMonth() - 1;
    let y = this.currentYear();
    if (m < 0) {
      m = 11;
      y--;
    }
    this.currentMonth.set(m);
    this.currentYear.set(y);
    this.selectedDay.set(1);
  }

  nextMonth() {
    let m = this.currentMonth() + 1;
    let y = this.currentYear();
    if (m > 11) {
      m = 0;
      y++;
    }
    this.currentMonth.set(m);
    this.currentYear.set(y);
    this.selectedDay.set(1);
  }

  goToToday() {
    const now = new Date();
    this.currentMonth.set(now.getMonth());
    this.currentYear.set(now.getFullYear());
    this.selectedDay.set(now.getDate());
  }

  selectDate(day: number) {
    this.selectedDay.set(day);
  }

  isTodayCell(day: number): boolean {
    const now = new Date();
    return day === now.getDate() && this.currentMonth() === now.getMonth() && this.currentYear() === now.getFullYear();
  }

  getAge(b: Birthday) {
    return calculateAge(b.birthMonth, b.birthDay, b.birthYear);
  }

  getCategoryColor(cat: string) {
    return getCategoryStyles(cat);
  }
}
