import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BirthdayService } from '../services/birthday';
import { Birthday } from '../models/birthday';

@Component({
  selector: 'app-delete-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div class="bg-white border border-[#E8E6E1] rounded-2xl w-full max-w-md shadow-xl overflow-hidden p-6 space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div class="flex items-center gap-3 text-[#EF4444]">
          <div class="w-12 h-12 rounded-2xl bg-[#FFDAD6] flex items-center justify-center shrink-0">
            <mat-icon class="text-2xl">warning</mat-icon>
          </div>
          <div>
            <h3 class="font-bold text-lg text-[#1E1E24]">Delete Birthday?</h3>
            <p class="text-xs text-[#6E6D7A]">Are you sure you want to delete {{ birthday().name }}? All scheduled reminders will be canceled immediately.</p>
          </div>
        </div>

        <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#E8E6E1]">
          <button 
            (click)="dismiss.emit()"
            class="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#FAF9F6] border border-[#E8E6E1] text-[#1E1E24] hover:bg-[#E8E6E1]/50 transition-colors">
            Cancel
          </button>
          <button 
            (click)="confirmDelete()"
            class="px-6 py-2.5 rounded-xl text-xs font-semibold bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-md shadow-[#EF4444]/20 transition-all">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  `
})
export class DeleteModal {
  readonly birthdayService = inject(BirthdayService);
  readonly birthday = input.required<Birthday>();
  readonly dismiss = output<void>();

  async confirmDelete() {
    const b = this.birthday();
    if (b) {
      await this.birthdayService.deleteBirthday(b.id);
      this.dismiss.emit();
    }
  }
}
