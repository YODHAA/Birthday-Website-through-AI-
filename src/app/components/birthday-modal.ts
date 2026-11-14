import { ChangeDetectionStrategy, Component, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { BirthdayService } from '../services/birthday';
import { Birthday, Category } from '../models/birthday';

@Component({
  selector: 'app-birthday-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  template: `
    <div class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div class="bg-white border border-[#E8E6E1] rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#E8E6E1] bg-[#FAF9F6]">
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rounded-lg bg-[#FF6B4A]/15 text-[#FF6B4A] flex items-center justify-center">
              <mat-icon class="text-lg">cake</mat-icon>
            </div>
            <h3 class="font-bold text-lg text-[#1E1E24]">{{ birthdayToEdit() ? 'Edit Birthday' : 'Add New Birthday' }}</h3>
          </div>
          <button (click)="dismiss.emit()" class="p-1.5 hover:bg-white rounded-lg text-[#6E6D7A] hover:text-[#1E1E24] transition-colors">
            <mat-icon class="text-lg">close</mat-icon>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="p-6 space-y-5">
          <!-- Duplicate Warning Banner -->
          @if (duplicateWarning()) {
            <div class="p-3 bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] rounded-xl text-xs flex items-center gap-2">
              <mat-icon class="text-sm">warning</mat-icon>
              <span>{{ duplicateWarning() }}</span>
            </div>
          }

          @if (errorMessage()) {
            <div class="p-3 bg-[#FFDAD6] border border-[#FFB4A3] text-[#93000A] rounded-xl text-xs flex items-center gap-2">
              <mat-icon class="text-sm">error</mat-icon>
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <!-- Full Name -->
          <div>
            <label for="bName" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Full Name *</label>
            <input 
              id="bName"
              type="text" 
              formControlName="name"
              placeholder="e.g. Maya Lin"
              class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]"
            />
          </div>

          <!-- Birth Date & Year Toggle -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="bMonth" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Birth Month *</label>
              <select 
                id="bMonth"
                formControlName="birthMonth"
                class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]">
                @for (m of months; track m.value) {
                  <option [value]="m.value">{{ m.name }}</option>
                }
              </select>
            </div>

            <div>
              <label for="bDay" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Birth Day *</label>
              <select 
                id="bDay"
                formControlName="birthDay"
                class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl px-4 py-2.5 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]">
                @for (d of daysInMonth; track d) {
                  <option [value]="d">{{ d }}</option>
                }
              </select>
            </div>
          </div>

          <!-- Include Year Toggle & Year Select -->
          <div class="bg-[#FAF9F6] p-4 rounded-xl border border-[#E8E6E1] space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <span class="text-sm font-bold text-[#1E1E24]">Include Birth Year</span>
                <p class="text-xs text-[#6E6D7A]">Enables age calculation and turning age milestones.</p>
              </div>
              <input 
                id="incYear"
                type="checkbox" 
                formControlName="includeYear"
                class="w-5 h-5 accent-[#FF6B4A] rounded cursor-pointer"
              />
            </div>

            @if (form.get('includeYear')?.value) {
              <div>
                <label for="bYear" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1">Birth Year</label>
                <input 
                  id="bYear"
                  type="number" 
                  formControlName="birthYear"
                  placeholder="1995"
                  min="1900" 
                  max="2026"
                  class="w-full bg-white border border-[#E8E6E1] rounded-xl px-4 py-2 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A]"
                />
              </div>
            }
          </div>

          <!-- Category Selector -->
          <div>
            <span class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Category</span>
            <div class="grid grid-cols-4 gap-2">
              @for (cat of categories; track cat.value) {
                <button 
                  type="button"
                  (click)="form.patchValue({ category: cat.value })"
                  class="py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center"
                  [class.bg-[#FF6B4A]]="form.get('category')?.value === cat.value"
                  [class.text-white]="form.get('category')?.value === cat.value"
                  [class.border-[#FF6B4A]]="form.get('category')?.value === cat.value"
                  [class.bg-[#FAF9F6]]="form.get('category')?.value !== cat.value"
                  [class.text-[#1E1E24]]="form.get('category')?.value !== cat.value"
                  [class.border-[#E8E6E1]]="form.get('category')?.value !== cat.value">
                  {{ cat.label }}
                </button>
              }
            </div>
          </div>

          <!-- Gift Ideas & Notes -->
          <div>
            <label for="bNotes" class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Gift Ideas & Notes</label>
            <textarea 
              id="bNotes"
              formControlName="notes"
              rows="3"
              placeholder="Clothing sizes, favorite coffee, gift links, wishlist..."
              class="w-full bg-[#FAF9F6] border border-[#E8E6E1] rounded-xl p-3 text-sm text-[#1E1E24] focus:outline-none focus:border-[#FF6B4A] resize-none"
            ></textarea>
          </div>

          <!-- Multi-Reminder Offsets -->
          <div>
            <span class="block text-xs font-bold text-[#1E1E24] uppercase tracking-wider mb-1.5">Reminder Offsets (Days Before)</span>
            <div class="flex flex-wrap gap-2">
              @for (offset of availableOffsets; track offset.days) {
                <button 
                  type="button"
                  (click)="toggleOffset(offset.days)"
                  class="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                  [class.bg-[#FF6B4A]]="isOffsetSelected(offset.days)"
                  [class.text-white]="isOffsetSelected(offset.days)"
                  [class.border-[#FF6B4A]]="isOffsetSelected(offset.days)"
                  [class.bg-[#FAF9F6]]="!isOffsetSelected(offset.days)"
                  [class.text-[#1E1E24]]="!isOffsetSelected(offset.days)"
                  [class.border-[#E8E6E1]]="!isOffsetSelected(offset.days)">
                  {{ offset.label }}
                </button>
              }
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E6E1]">
            <button 
              type="button"
              (click)="dismiss.emit()"
              class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#FAF9F6] border border-[#E8E6E1] text-[#1E1E24] hover:bg-[#E8E6E1]/50 transition-colors">
              Cancel
            </button>
            <button 
              type="submit"
              [disabled]="form.invalid"
              class="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#FF6B4A] hover:bg-[#FA5A36] text-white shadow-md shadow-[#FF6B4A]/20 transition-all disabled:opacity-50">
              {{ birthdayToEdit() ? 'Save Changes' : 'Save Birthday' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `
})
export class BirthdayModal {
  private fb = inject(FormBuilder);
  readonly birthdayService = inject(BirthdayService);

  readonly birthdayToEdit = input<Birthday | null>(null);
  readonly dismiss = output<void>();

  readonly duplicateWarning = signal<string | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly months = [
    { value: 1, name: 'January' }, { value: 2, name: 'February' }, { value: 3, name: 'March' },
    { value: 4, name: 'April' }, { value: 5, name: 'May' }, { value: 6, name: 'June' },
    { value: 7, name: 'July' }, { value: 8, name: 'August' }, { value: 9, name: 'September' },
    { value: 10, name: 'October' }, { value: 11, name: 'November' }, { value: 12, name: 'December' }
  ];

  readonly daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  readonly categories: { label: string; value: Category }[] = [
    { label: 'Family', value: 'FAMILY' },
    { label: 'Friends', value: 'FRIENDS' },
    { label: 'Colleagues', value: 'COLLEAGUES' },
    { label: 'Other', value: 'OTHER' }
  ];

  readonly availableOffsets = [
    { days: 0, label: 'Same Day' },
    { days: 1, label: '1 Day Before' },
    { days: 3, label: '3 Days Before' },
    { days: 7, label: '7 Days Before' },
    { days: 14, label: '14 Days Before' }
  ];

  readonly form: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(100)]],
    birthMonth: [new Date().getMonth() + 1, [Validators.required]],
    birthDay: [new Date().getDate(), [Validators.required]],
    includeYear: [true],
    birthYear: [1995],
    category: ['FRIENDS', [Validators.required]],
    notes: [''],
    reminderOffsets: [[0, 1, 7]]
  });

  constructor() {
    effect(() => {
      const b = this.birthdayToEdit();
      if (b) {
        this.form.patchValue({
          name: b.name,
          birthMonth: b.birthMonth,
          birthDay: b.birthDay,
          includeYear: b.birthYear !== null,
          birthYear: b.birthYear || 1995,
          category: b.category,
          notes: b.notes,
          reminderOffsets: b.reminderOffsets || [0, 1, 7]
        });
      }
    });
  }

  isOffsetSelected(days: number): boolean {
    const offsets = this.form.get('reminderOffsets')?.value || [];
    return offsets.includes(days);
  }

  toggleOffset(days: number) {
    let offsets = [...(this.form.get('reminderOffsets')?.value || [])];
    if (offsets.includes(days)) {
      offsets = offsets.filter(d => d !== days);
    } else {
      offsets.push(days);
      offsets.sort((a, b) => a - b);
    }
    this.form.patchValue({ reminderOffsets: offsets });
  }

  async onSubmit() {
    if (this.form.invalid) return;

    const val = this.form.value;
    const includeYear = val.includeYear;
    const payload = {
      name: val.name,
      birthMonth: Number(val.birthMonth),
      birthDay: Number(val.birthDay),
      birthYear: includeYear ? Number(val.birthYear) : null,
      category: val.category,
      notes: val.notes,
      reminderOffsets: val.reminderOffsets,
      isMuted: false
    };

    const editing = this.birthdayToEdit();
    if (editing) {
      const success = await this.birthdayService.updateBirthday(editing.id, payload);
      if (success) {
        this.dismiss.emit();
      } else {
        this.errorMessage.set('Failed to update birthday.');
      }
    } else {
      const res = await this.birthdayService.addBirthday(payload);
      if (res.success) {
        this.dismiss.emit();
      } else {
        this.duplicateWarning.set(res.error || 'Duplicate birthday detected.');
      }
    }
  }
}
