import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BirthdayService } from '../services/birthday';
import { Birthday } from '../models/birthday';
import { calculateDaysUntil, calculateAge, formatBirthdayDate, getCategoryStyles } from '../utils/date-utils';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="space-y-6 pb-20 lg:pb-8">
      <!-- Top Header & Greeting -->
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-xs">
        <div>
          <div class="flex items-center gap-2 text-xs text-[#6E6D7A] mb-1">
            <span class="inline-block w-2 h-2 rounded-full bg-[#10B981]"></span>
            <span>Time Zone: {{ birthdayService.user()?.timezone || 'UTC' }}</span>
            <span>·</span>
            <span>Preferred alert: {{ birthdayService.user()?.defaultReminderTime || '09:00' }}</span>
          </div>
          <h2 class="text-2xl font-bold text-[#1E1E24]">Good {{ getTimeGreeting() }}, {{ getUserFirstName() }}</h2>
          <p class="text-sm text-[#6E6D7A]">You have {{ todaysBirthdays().length }} birthday(s) celebrating today and {{ upcomingCount() }} upcoming this month.</p>
        </div>
        
        <div class="flex items-center gap-3">
          <div class="relative flex-1 md:w-72">
            <mat-icon class="absolute left-3 top-2.5 text-[#6E6D7A] text-lg">search</mat-icon>
            <input 
              type="text" 
              [value]="birthdayService.searchQuery()"
              (input)="onSearchInput($event)"
              placeholder="Search by name or gift idea..." 
              class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl pl-10 pr-4 py-2 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>
          
          <button 
            (click)="openAddModal.emit()"
            class="hidden sm:flex items-center gap-2 bg-[#FF6B4A] hover:bg-[#FA5A36] text-white font-medium py-2 px-4 rounded-xl shadow-md shadow-[#FF6B4A]/20 transition-all text-sm shrink-0">
            <mat-icon>add</mat-icon>
            <span>Add Birthday</span>
          </button>
        </div>
      </div>

      <!-- Today's Birthdays Spotlight Banner -->
      @if (todaysBirthdays().length > 0) {
        <div class="bg-gradient-to-br from-[#FFF5F2] to-[#FFFFFF] border border-[#FF6B4A]/25 rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div class="absolute right-4 top-4 text-[#FF6B4A]/10 text-8xl font-bold pointer-events-none select-none">
            <mat-icon class="text-8xl">celebration</mat-icon>
          </div>
          
          <div class="flex items-center gap-2 text-[#FF6B4A] font-semibold text-xs tracking-wider uppercase mb-3">
            <mat-icon class="text-sm">auto_awesome</mat-icon>
            <span>Celebrating Today</span>
          </div>

          @for (b of todaysBirthdays(); track b.id) {
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-2xl bg-[#FF6B4A] text-white font-bold text-2xl flex items-center justify-center shadow-md shadow-[#FF6B4A]/30 shrink-0">
                  {{ b.name.charAt(0) }}
                </div>
                <div>
                  <div class="flex items-center gap-3">
                    <h3 class="text-xl font-bold text-[#1E1E24]">{{ b.name }}</h3>
                    @let ageInfo = getAge(b);
                    @if (ageInfo.turningAge !== null) {
                      <span class="bg-[#FF6B4A]/15 text-[#FF6B4A] px-2.5 py-0.5 rounded-full text-xs font-bold font-mono-tabular">
                        Turning {{ ageInfo.turningAge }}
                      </span>
                    }
                    <span [class]="'px-2.5 py-0.5 rounded-full text-xs font-semibold ' + getCategoryColor(b.category).bg + ' ' + getCategoryColor(b.category).text">
                      {{ b.category }}
                    </span>
                  </div>
                  <p class="text-sm text-[#6E6D7A] mt-1">
                    @if (b.notes) {
                      <span class="italic text-[#1E1E24]">Gift Note:</span> {{ b.notes }}
                    } @else {
                      No gift notes added yet. Click edit to add preferences.
                    }
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-3 shrink-0">
                <button 
                  (click)="copyWishMessage(b)"
                  class="flex items-center gap-1.5 bg-white hover:bg-[#FAF9F6] border border-[#E8E6E1] text-[#1E1E24] px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xs transition-colors">
                  <mat-icon class="text-sm text-[#FF6B4A]">content_copy</mat-icon>
                  <span>Copy Wish</span>
                </button>
                <button 
                  (click)="markWished(b)"
                  class="flex items-center gap-1.5 bg-[#FF6B4A] hover:bg-[#FA5A36] text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-colors">
                  <mat-icon class="text-sm">send</mat-icon>
                  <span>Send Greeting</span>
                </button>
              </div>
            </div>
          }
        </div>
      }

      <!-- Category Filter Pills -->
      <div class="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button 
          (click)="setCategory('ALL')"
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          [class.bg-[#1E1E24]]="birthdayService.selectedCategory() === 'ALL'"
          [class.text-white]="birthdayService.selectedCategory() === 'ALL'"
          [class.bg-white]="birthdayService.selectedCategory() !== 'ALL'"
          [class.text-[#6E6D7A]]="birthdayService.selectedCategory() !== 'ALL'"
          [class.border]="birthdayService.selectedCategory() !== 'ALL'"
          [class.border-[#E8E6E1]]="birthdayService.selectedCategory() !== 'ALL'">
          All Categories ({{ birthdayService.birthdays().length }})
        </button>

        <button 
          (click)="setCategory('FAMILY')"
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          [class.bg-[#BE123C]]="birthdayService.selectedCategory() === 'FAMILY'"
          [class.text-white]="birthdayService.selectedCategory() === 'FAMILY'"
          [class.bg-[#FFE4E6]]="birthdayService.selectedCategory() !== 'FAMILY'"
          [class.text-[#BE123C]]="birthdayService.selectedCategory() !== 'FAMILY'">
          Family
        </button>

        <button 
          (click)="setCategory('FRIENDS')"
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          [class.bg-[#0369A1]]="birthdayService.selectedCategory() === 'FRIENDS'"
          [class.text-white]="birthdayService.selectedCategory() === 'FRIENDS'"
          [class.bg-[#E0F2FE]]="birthdayService.selectedCategory() !== 'FRIENDS'"
          [class.text-[#0369A1]]="birthdayService.selectedCategory() !== 'FRIENDS'">
          Friends
        </button>

        <button 
          (click)="setCategory('COLLEAGUES')"
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          [class.bg-[#B45309]]="birthdayService.selectedCategory() === 'COLLEAGUES'"
          [class.text-white]="birthdayService.selectedCategory() === 'COLLEAGUES'"
          [class.bg-[#FEF3C7]]="birthdayService.selectedCategory() !== 'COLLEAGUES'"
          [class.text-[#B45309]]="birthdayService.selectedCategory() !== 'COLLEAGUES'">
          Colleagues
        </button>

        <button 
          (click)="setCategory('OTHER')"
          class="px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap shrink-0"
          [class.bg-[#6B21A8]]="birthdayService.selectedCategory() === 'OTHER'"
          [class.text-white]="birthdayService.selectedCategory() === 'OTHER'"
          [class.bg-[#F3E8FF]]="birthdayService.selectedCategory() !== 'OTHER'"
          [class.text-[#6B21A8]]="birthdayService.selectedCategory() !== 'OTHER'">
          Other
        </button>
      </div>

      <!-- Chronological Feed -->
      <div class="space-y-6">
        @if (filteredBirthdays().length === 0) {
          <div class="bg-white border border-[#E8E6E1] rounded-2xl p-12 text-center">
            <mat-icon class="text-5xl text-[#6E6D7A] mb-3">event_busy</mat-icon>
            <h3 class="text-lg font-bold text-[#1E1E24]">No birthdays found</h3>
            <p class="text-sm text-[#6E6D7A] mt-1">Try adjusting your search query or category filter.</p>
          </div>
        } @else {
          <!-- This Week Group -->
          @if (thisWeekBirthdays().length > 0) {
            <div>
              <h3 class="text-sm font-bold text-[#6E6D7A] uppercase tracking-wider mb-3">This Week (Next 7 Days)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (b of thisWeekBirthdays(); track b.id) {
                  <div class="bg-white border border-[#E8E6E1] hover:border-[#FF6B4A]/40 rounded-2xl p-5 shadow-xs transition-all flex items-start justify-between gap-4 group">
                    <div class="flex items-start gap-4 min-w-0">
                      <div class="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1] text-[#1E1E24] font-bold text-lg flex items-center justify-center shrink-0">
                        {{ b.name.charAt(0) }}
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <h4 class="font-bold text-[#1E1E24] truncate">{{ b.name }}</h4>
                          <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-semibold ' + getCategoryColor(b.category).bg + ' ' + getCategoryColor(b.category).text">
                            {{ b.category }}
                          </span>
                        </div>
                        <p class="text-xs text-[#6E6D7A] mt-0.5">
                          {{ formatDate(b) }} 
                          @let ageInfo = getAge(b);
                          @if (ageInfo.turningAge !== null) {
                            <span>· Turning {{ ageInfo.turningAge }}</span>
                          } @else {
                            <span>· Age hidden</span>
                          }
                        </p>
                        @if (b.notes) {
                          <p class="text-xs text-[#1E1E24] mt-2 bg-[#FAF9F6] p-2 rounded-lg border border-[#E8E6E1] truncate">
                            <span class="font-semibold">Gift Idea:</span> {{ b.notes }}
                          </p>
                        }
                      </div>
                    </div>

                    <div class="flex flex-col items-end justify-between h-full shrink-0">
                      @let days = getDaysUntil(b);
                      <span class="px-3 py-1 rounded-full text-xs font-bold font-mono-tabular"
                        [class.bg-[#FF6B4A]]="days === 0"
                        [class.text-white]="days === 0"
                        [class.bg-[#FAF9F6]]="days > 0"
                        [class.text-[#1E1E24]]="days > 0"
                        [class.border]="days > 0"
                        [class.border-[#E8E6E1]]="days > 0">
                        {{ days === 0 ? 'Today' : days === 1 ? 'Tomorrow' : 'In ' + days + ' days' }}
                      </span>

                      <div class="flex items-center gap-1 mt-4">
                        <button (click)="openEditModal.emit(b)" class="p-1.5 hover:bg-[#FAF9F6] text-[#6E6D7A] hover:text-[#1E1E24] rounded-lg transition-colors" title="Edit">
                          <mat-icon class="text-sm">edit</mat-icon>
                        </button>
                        <button (click)="openDeleteModal.emit(b)" class="p-1.5 hover:bg-[#FAF9F6] text-[#6E6D7A] hover:text-[#EF4444] rounded-lg transition-colors" title="Delete">
                          <mat-icon class="text-sm">delete</mat-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }

          <!-- Upcoming 30 Days Group -->
          @if (laterBirthdays().length > 0) {
            <div>
              <h3 class="text-sm font-bold text-[#6E6D7A] uppercase tracking-wider mb-3">Upcoming (Later This Year)</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (b of laterBirthdays(); track b.id) {
                  <div class="bg-white border border-[#E8E6E1] hover:border-[#FF6B4A]/40 rounded-2xl p-5 shadow-xs transition-all flex items-start justify-between gap-4 group">
                    <div class="flex items-start gap-4 min-w-0">
                      <div class="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E8E6E1] text-[#1E1E24] font-bold text-lg flex items-center justify-center shrink-0">
                        {{ b.name.charAt(0) }}
                      </div>
                      <div class="min-w-0">
                        <div class="flex items-center gap-2 flex-wrap">
                          <h4 class="font-bold text-[#1E1E24] truncate">{{ b.name }}</h4>
                          <span [class]="'px-2 py-0.5 rounded-full text-[10px] font-semibold ' + getCategoryColor(b.category).bg + ' ' + getCategoryColor(b.category).text">
                            {{ b.category }}
                          </span>
                        </div>
                        <p class="text-xs text-[#6E6D7A] mt-0.5">
                          {{ formatDate(b) }} 
                          @let ageInfo = getAge(b);
                          @if (ageInfo.turningAge !== null) {
                            <span>· Turning {{ ageInfo.turningAge }}</span>
                          } @else {
                            <span>· Age hidden</span>
                          }
                        </p>
                        @if (b.notes) {
                          <p class="text-xs text-[#1E1E24] mt-2 bg-[#FAF9F6] p-2 rounded-lg border border-[#E8E6E1] truncate">
                            <span class="font-semibold">Gift Idea:</span> {{ b.notes }}
                          </p>
                        }
                      </div>
                    </div>

                    <div class="flex flex-col items-end justify-between h-full shrink-0">
                      @let days = getDaysUntil(b);
                      <span class="px-3 py-1 rounded-full text-xs font-bold font-mono-tabular bg-[#FAF9F6] text-[#6E6D7A] border border-[#E8E6E1]">
                        In {{ days }} days
                      </span>

                      <div class="flex items-center gap-1 mt-4">
                        <button (click)="openEditModal.emit(b)" class="p-1.5 hover:bg-[#FAF9F6] text-[#6E6D7A] hover:text-[#1E1E24] rounded-lg transition-colors" title="Edit">
                          <mat-icon class="text-sm">edit</mat-icon>
                        </button>
                        <button (click)="openDeleteModal.emit(b)" class="p-1.5 hover:bg-[#FAF9F6] text-[#6E6D7A] hover:text-[#EF4444] rounded-lg transition-colors" title="Delete">
                          <mat-icon class="text-sm">delete</mat-icon>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class Dashboard {
  readonly birthdayService = inject(BirthdayService);
  readonly openAddModal = output<void>();
  readonly openEditModal = output<Birthday>();
  readonly openDeleteModal = output<Birthday>();

  readonly sortedBirthdays = computed(() => {
    const list = [...this.birthdayService.birthdays()];
    return list.sort((a, b) => calculateDaysUntil(a.birthMonth, a.birthDay) - calculateDaysUntil(b.birthMonth, b.birthDay));
  });

  readonly filteredBirthdays = computed(() => {
    const q = this.birthdayService.searchQuery().toLowerCase().trim();
    const cat = this.birthdayService.selectedCategory();
    return this.sortedBirthdays().filter(b => {
      const matchCat = cat === 'ALL' || b.category === cat;
      const matchQuery = !q || b.name.toLowerCase().includes(q) || b.notes.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  });

  readonly todaysBirthdays = computed(() => {
    return this.sortedBirthdays().filter(b => calculateDaysUntil(b.birthMonth, b.birthDay) === 0);
  });

  readonly upcomingCount = computed(() => {
    return this.sortedBirthdays().filter(b => {
      const d = calculateDaysUntil(b.birthMonth, b.birthDay);
      return d > 0 && d <= 30;
    }).length;
  });

  readonly thisWeekBirthdays = computed(() => {
    return this.filteredBirthdays().filter(b => {
      const d = calculateDaysUntil(b.birthMonth, b.birthDay);
      return d >= 0 && d <= 7;
    });
  });

  readonly laterBirthdays = computed(() => {
    return this.filteredBirthdays().filter(b => {
      const d = calculateDaysUntil(b.birthMonth, b.birthDay);
      return d > 7;
    });
  });

  getUserFirstName(): string {
    const usr = this.birthdayService.user();
    if (!usr || !usr.name) return 'Friend';
    return usr.name.split(' ')[0];
  }

  getTimeGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    return 'evening';
  }

  onSearchInput(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.birthdayService.searchQuery.set(val);
  }

  setCategory(cat: string) {
    this.birthdayService.selectedCategory.set(cat);
  }

  getDaysUntil(b: Birthday): number {
    return calculateDaysUntil(b.birthMonth, b.birthDay);
  }

  getAge(b: Birthday) {
    return calculateAge(b.birthMonth, b.birthDay, b.birthYear);
  }

  formatDate(b: Birthday): string {
    return formatBirthdayDate(b.birthMonth, b.birthDay, b.birthYear);
  }

  getCategoryColor(cat: string) {
    return getCategoryStyles(cat);
  }

  copyWishMessage(b: Birthday) {
    const msg = `Happy Birthday, ${b.name}! Wishing you wonderful happiness, success, and joy today and always! 🎉`;
    navigator.clipboard.writeText(msg);
    alert(`Copied greeting for ${b.name} to clipboard!`);
  }

  markWished(b: Birthday) {
    alert(`Greeting sent to ${b.name}! A celebratory log entry has been recorded.`);
  }
}
